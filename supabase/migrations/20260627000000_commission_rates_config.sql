-- =========================
-- Commission rates as a single source of truth
-- =========================
-- The admin dashboard edits L1/L2/L3 referral commission rates and upserts them
-- into public.commission_rates. This migration creates that table (previously it
-- existed only in the live project / generated types), seeds the defaults, locks
-- it down with RLS, and rewires the enrollment commission trigger to read its
-- rates from this table instead of hardcoding 7 / 3 / 2.5.

CREATE TABLE IF NOT EXISTS public.commission_rates (
  level integer PRIMARY KEY CHECK (level IN (1, 2, 3)),
  percentage numeric NOT NULL,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.commission_rates (level, percentage)
VALUES (1, 7), (2, 3), (3, 2.5)
ON CONFLICT (level) DO NOTHING;

-- =========================
-- RLS: anyone may read rates (students + public marketing pages);
-- only admins may change them.
-- =========================
ALTER TABLE public.commission_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read commission rates" ON public.commission_rates FOR SELECT
  USING (true);
CREATE POLICY "admin write commission rates" ON public.commission_rates FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- Enrollment commission processor — now reads rates from commission_rates.
-- The fetched percentage is written into each commissions row, so existing
-- commissions remain snapshots of the rate at the time they were created.
-- =========================
CREATE OR REPLACE FUNCTION public.process_enrollment_commissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  l1 uuid;
  l2 uuid;
  l3 uuid;
  p1 numeric;
  p2 numeric;
  p3 numeric;
BEGIN
  IF NEW.referral_code_used IS NULL OR NEW.referral_code_used = '' THEN
    RETURN NEW;
  END IF;

  SELECT id INTO l1 FROM public.profiles WHERE referral_code = upper(NEW.referral_code_used) LIMIT 1;
  IF l1 IS NULL THEN RETURN NEW; END IF;

  SELECT COALESCE((SELECT percentage FROM public.commission_rates WHERE level = 1), 7) INTO p1;
  SELECT COALESCE((SELECT percentage FROM public.commission_rates WHERE level = 2), 3) INTO p2;
  SELECT COALESCE((SELECT percentage FROM public.commission_rates WHERE level = 3), 2.5) INTO p3;

  INSERT INTO public.commissions (enrollment_id, beneficiary_id, level, percentage, amount, status)
  VALUES (NEW.id, l1, 1, p1, (NEW.amount_paid * p1 / 100.0), 'pending')
  ON CONFLICT (enrollment_id, level) DO NOTHING;

  SELECT referred_by INTO l2 FROM public.profiles WHERE id = l1;
  IF l2 IS NOT NULL THEN
    INSERT INTO public.commissions (enrollment_id, beneficiary_id, level, percentage, amount, status)
    VALUES (NEW.id, l2, 2, p2, (NEW.amount_paid * p2 / 100.0), 'pending')
    ON CONFLICT (enrollment_id, level) DO NOTHING;

    SELECT referred_by INTO l3 FROM public.profiles WHERE id = l2;
    IF l3 IS NOT NULL THEN
      INSERT INTO public.commissions (enrollment_id, beneficiary_id, level, percentage, amount, status)
      VALUES (NEW.id, l3, 3, p3, (NEW.amount_paid * p3 / 100.0), 'pending')
      ON CONFLICT (enrollment_id, level) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
