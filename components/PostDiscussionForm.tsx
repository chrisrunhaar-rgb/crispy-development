"use client";

import { useActionState, useRef } from "react";
import { postDiscussion } from "@/app/(app)/community/actions";

type State = { error?: string; success?: boolean } | null;

export default function PostDiscussionForm({
  moduleId,
  userName,
}: {
  moduleId: string | null;
  userName: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await postDiscussion(formData);
      if (!result?.error) formRef.current?.reset();
      return result ?? null;
    },
    null,
  );

  return (
    <form ref={formRef} action={action} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <input type="hidden" name="moduleId" value={moduleId ?? ""} />
      <input type="hidden" name="userName" value={userName} />
      <textarea
        name="content"
        required
        rows={3}
        maxLength={2000}
        placeholder="What's on your mind?"
        style={{
          width: "100%",
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.9375rem",
          color: "oklch(22% 0.005 260)",
          background: "oklch(99% 0.002 80)",
          border: "1px solid oklch(82% 0.008 80)",
          padding: "0.75rem 1rem",
          outline: "none",
          resize: "vertical",
          lineHeight: 1.6,
          boxSizing: "border-box",
        }}
      />
      {state?.error && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(45% 0.18 25)" }}>
          {state.error}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={pending}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "oklch(97% 0.005 80)",
            background: pending ? "oklch(55% 0.008 260)" : "oklch(30% 0.12 260)",
            border: "none",
            padding: "0.625rem 1.5rem",
            cursor: pending ? "not-allowed" : "pointer",
          }}
        >
          {pending ? "Posting…" : "Post →"}
        </button>
      </div>
    </form>
  );
}
