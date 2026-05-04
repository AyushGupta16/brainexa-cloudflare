import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const BodySchema = z.object({
  enrollment_id: z.string().uuid(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { enrollment_id } = parsed.data;

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: enrollment, error: eErr } = await admin
      .from("enrollments")
      .select("id, amount_paid, referral_code_used")
      .eq("id", enrollment_id)
      .single();

    if (eErr || !enrollment) {
      return new Response(JSON.stringify({ error: "Enrollment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const refCode = enrollment.referral_code_used?.toUpperCase();
    if (!refCode) {
      return new Response(JSON.stringify({ ok: true, inserted: 0, reason: "no_referral_code" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amount = Number(enrollment.amount_paid);
    const levels = [
      { level: 1, percentage: 7 },
      { level: 2, percentage: 3 },
      { level: 3, percentage: 2.5 },
    ];

    // Walk the upline
    const { data: l1 } = await admin
      .from("profiles")
      .select("id, referred_by")
      .eq("referral_code", refCode)
      .maybeSingle();

    if (!l1) {
      return new Response(JSON.stringify({ ok: true, inserted: 0, reason: "no_l1" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const beneficiaries: Array<{ id: string | null }> = [{ id: l1.id }];

    if (l1.referred_by) {
      const { data: l2 } = await admin
        .from("profiles")
        .select("id, referred_by")
        .eq("id", l1.referred_by)
        .maybeSingle();
      beneficiaries.push({ id: l2?.id ?? null });

      if (l2?.referred_by) {
        const { data: l3 } = await admin
          .from("profiles")
          .select("id")
          .eq("id", l2.referred_by)
          .maybeSingle();
        beneficiaries.push({ id: l3?.id ?? null });
      }
    }

    const rows = beneficiaries
      .map((b, i) => {
        if (!b.id) return null;
        const { level, percentage } = levels[i];
        return {
          enrollment_id,
          beneficiary_id: b.id,
          level,
          percentage,
          amount: (amount * percentage) / 100,
          status: "pending",
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ ok: true, inserted: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: insErr } = await admin
      .from("commissions")
      .upsert(rows, { onConflict: "enrollment_id,level", ignoreDuplicates: true });

    if (insErr) {
      return new Response(JSON.stringify({ error: insErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, inserted: rows.length }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
