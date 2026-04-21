"use client";

import { useTransition } from "react";
import { addTeamContent, removeTeamContent } from "@/app/(app)/dashboard/actions";

type Module = {
  id: string;
  title: string;
  type: string;
  is_free: boolean;
};

export default function AddTeamContentForm({
  teamId,
  allModules,
  selectedIds,
}: {
  teamId: string;
  allModules: Module[];
  selectedIds: Set<string>;
}) {
  const [isPending, startTransition] = useTransition();
  const unselected = allModules.filter(m => !selectedIds.has(m.id));

  if (unselected.length === 0) {
    return (
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(55% 0.008 260)" }}>
        All available modules are selected.
      </p>
    );
  }

  return (
    <div>
      <p className="t-label" style={{ color: "oklch(52% 0.008 260)", fontSize: "0.62rem", marginBottom: "0.75rem" }}>Add to team</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {unselected.map(mod => (
          <form key={mod.id} onSubmit={e => { e.preventDefault(); startTransition(() => { const fd = new FormData(e.currentTarget); addTeamContent(fd); }); }}>
            <input type="hidden" name="teamId" value={teamId} />
            <input type="hidden" name="moduleId" value={mod.id} />
            <button
              type="submit"
              disabled={isPending}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                color: "oklch(38% 0.008 260)",
                background: "oklch(96% 0.004 80)",
                border: "1px solid oklch(88% 0.008 80)",
                padding: "0.625rem 0.875rem",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontWeight: 500 }}>{mod.title}</span>
              <span style={{ fontWeight: 700, color: "oklch(65% 0.15 45)", flexShrink: 0, fontSize: "0.72rem" }}>+ Add</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
