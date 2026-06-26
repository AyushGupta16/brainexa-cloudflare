import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ReferralRates {
  L1: number;
  L2: number;
  L3: number;
}

/**
 * Defaults used for first paint / SSR and as a per-level fallback when the
 * commission_rates table can't be read. These mirror the seeded values.
 */
export const DEFAULT_REFERRAL_RATES: ReferralRates = { L1: 7, L2: 3, L3: 2.5 };

/** Fetch the live referral commission rates from the single source of truth. */
export async function fetchCommissionRates(): Promise<ReferralRates> {
  const rates: ReferralRates = { ...DEFAULT_REFERRAL_RATES };

  const { data, error } = await supabase
    .from("commission_rates")
    .select("level, percentage");

  if (error || !data) return rates;

  data.forEach((r) => {
    if (r.level === 1) rates.L1 = Number(r.percentage);
    if (r.level === 2) rates.L2 = Number(r.percentage);
    if (r.level === 3) rates.L3 = Number(r.percentage);
  });

  return rates;
}

/**
 * React hook exposing the live commission rates. Starts from the defaults so the
 * UI renders correct values immediately, then refreshes from the database.
 */
export function useCommissionRates(): { rates: ReferralRates; loading: boolean } {
  const [rates, setRates] = useState<ReferralRates>(DEFAULT_REFERRAL_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchCommissionRates()
      .then((r) => {
        if (active) setRates(r);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { rates, loading };
}
