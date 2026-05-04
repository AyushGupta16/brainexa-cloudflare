
-- =========================
-- ENUMS
-- =========================
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- =========================
-- TABLES
-- =========================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('admin','teacher','student')),
  referral_code text UNIQUE NOT NULL DEFAULT '',
  referred_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price integer NOT NULL DEFAULT 299,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  order_index integer DEFAULT 0
);

CREATE TABLE public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  order_index integer DEFAULT 0
);

CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE CASCADE,
  title text NOT NULL,
  youtube_url text,
  unlock_at timestamptz,
  pdf_url text,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT false
);

CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.profiles(id),
  course_id uuid REFERENCES public.courses(id),
  amount_paid integer NOT NULL,
  referral_code_used text,
  payment_id text,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES public.enrollments(id) ON DELETE CASCADE,
  beneficiary_id uuid REFERENCES public.profiles(id),
  level integer CHECK (level IN (1,2,3)),
  percentage numeric NOT NULL,
  amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','paid')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (enrollment_id, level)
);

CREATE TABLE public.doubts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES public.topics(id),
  student_id uuid REFERENCES public.profiles(id),
  question text NOT NULL,
  answer text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','answered')),
  answered_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.topic_completions (
  student_id uuid REFERENCES public.profiles(id),
  topic_id uuid REFERENCES public.topics(id),
  completed_at timestamptz DEFAULT now(),
  PRIMARY KEY (student_id, topic_id)
);

CREATE TABLE public.teacher_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id),
  month text NOT NULL,
  fixed_amount integer NOT NULL,
  paid_amount integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending','paid'))
);

CREATE TABLE public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  amount numeric NOT NULL,
  upi_id text NOT NULL,
  status text DEFAULT 'requested' CHECK (status IN ('requested','processing','paid','rejected')),
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- =========================
-- SECURITY DEFINER: has_role
-- =========================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- =========================
-- Referral code generator
-- =========================
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := upper(substring(NEW.id::text, 1, 8));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_referral_code();

-- =========================
-- Auto-create profile + role on signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_code text;
  ref_owner uuid;
BEGIN
  ref_code := NEW.raw_user_meta_data->>'referral_code';

  IF ref_code IS NOT NULL AND ref_code <> '' THEN
    SELECT id INTO ref_owner FROM public.profiles WHERE referral_code = upper(ref_code) LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, name, phone, role, referred_by)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'User'),
    NEW.raw_user_meta_data->>'phone',
    'student',
    ref_owner
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- Enrollment commission processor (3 levels: 7% / 3% / 2.5%)
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
BEGIN
  IF NEW.referral_code_used IS NULL OR NEW.referral_code_used = '' THEN
    RETURN NEW;
  END IF;

  SELECT id INTO l1 FROM public.profiles WHERE referral_code = upper(NEW.referral_code_used) LIMIT 1;
  IF l1 IS NULL THEN RETURN NEW; END IF;

  INSERT INTO public.commissions (enrollment_id, beneficiary_id, level, percentage, amount, status)
  VALUES (NEW.id, l1, 1, 7, (NEW.amount_paid * 7.0 / 100.0), 'pending')
  ON CONFLICT (enrollment_id, level) DO NOTHING;

  SELECT referred_by INTO l2 FROM public.profiles WHERE id = l1;
  IF l2 IS NOT NULL THEN
    INSERT INTO public.commissions (enrollment_id, beneficiary_id, level, percentage, amount, status)
    VALUES (NEW.id, l2, 2, 3, (NEW.amount_paid * 3.0 / 100.0), 'pending')
    ON CONFLICT (enrollment_id, level) DO NOTHING;

    SELECT referred_by INTO l3 FROM public.profiles WHERE id = l2;
    IF l3 IS NOT NULL THEN
      INSERT INTO public.commissions (enrollment_id, beneficiary_id, level, percentage, amount, status)
      VALUES (NEW.id, l3, 3, 2.5, (NEW.amount_paid * 2.5 / 100.0), 'pending')
      ON CONFLICT (enrollment_id, level) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_enrollment_created
  AFTER INSERT ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.process_enrollment_commissions();

-- =========================
-- ENABLE RLS
-- =========================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- =========================
-- POLICIES
-- =========================

-- profiles
CREATE POLICY "own profile" ON public.profiles FOR ALL
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "admin all profiles" ON public.profiles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- courses
CREATE POLICY "public read courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "admin write courses" ON public.courses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- subjects
CREATE POLICY "public read subjects" ON public.subjects FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_active = true));
CREATE POLICY "admin write subjects" ON public.subjects FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- chapters
CREATE POLICY "public read chapters" ON public.chapters FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.subjects s
    JOIN public.courses c ON c.id = s.course_id
    WHERE s.id = subject_id AND c.is_active = true
  ));
CREATE POLICY "admin write chapters" ON public.chapters FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- topics
CREATE POLICY "published topics readable" ON public.topics FOR SELECT USING (is_published = true);
CREATE POLICY "teacher/admin write topics" ON public.topics FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

-- enrollments
CREATE POLICY "own enrollments" ON public.enrollments FOR ALL
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());
CREATE POLICY "admin all enrollments" ON public.enrollments FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- commissions
CREATE POLICY "own commissions read" ON public.commissions FOR SELECT
  USING (beneficiary_id = auth.uid());
CREATE POLICY "admin all commissions" ON public.commissions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- doubts
CREATE POLICY "student doubts" ON public.doubts FOR ALL
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());
CREATE POLICY "teacher read doubts" ON public.doubts FOR SELECT
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "teacher answer doubts" ON public.doubts FOR UPDATE
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

-- topic_completions
CREATE POLICY "own completions" ON public.topic_completions FOR ALL
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

-- teacher_earnings
CREATE POLICY "own earnings" ON public.teacher_earnings FOR SELECT
  USING (teacher_id = auth.uid());
CREATE POLICY "admin all earnings" ON public.teacher_earnings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- withdrawals
CREATE POLICY "own withdrawals" ON public.withdrawals FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin all withdrawals" ON public.withdrawals FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
