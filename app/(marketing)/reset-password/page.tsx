"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { changePassword } from "@/app/(app)/account/password/actions";

export const dynamic = "force-dynamic";

const initialState = { error: "", success: false };

export default function ResetPasswordPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await changePassword(formData);
      return { error: result.error ?? "", success: result.success ?? false };
    },
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state.success, router]);

  return (
    <div style={{
      minHeight: "calc(100dvh - 120px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBlock: "4rem",
      paddingInline: "1.5rem",
      background: "oklch(97% 0.005 80)",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            Password reset
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: "oklch(22% 0.005 260)", lineHeight: 1.15, marginBottom: "0.625rem" }}>
            Set a new password.
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)" }}>
            Choose a password with at least 8 characters.
          </p>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {state.error && (
            <div style={{ background: "oklch(95% 0.02 25)", border: "1px solid oklch(75% 0.08 25)", padding: "0.875rem 1rem", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(35% 0.1 25)" }}>
              {state.error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label" htmlFor="password">New password</label>
            <input
              className="form-input"
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="confirm">Confirm new password</label>
            <input
              className="form-input"
              type="password"
              id="confirm"
              name="confirm"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={pending || state.success}
            style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", opacity: pending ? 0.7 : 1 }}
          >
            {pending ? "Saving…" : state.success ? "Done! Redirecting…" : "Set new password →"}
          </button>
        </form>
      </div>
    </div>
  );
}
