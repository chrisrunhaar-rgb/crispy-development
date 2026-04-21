"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PushNotificationPrompt />
      <main style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {children}
      </main>
      <AppBottomNav />
    </>
  );
}

function AppBottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Home", icon: HomeIcon },
    { href: "/resources", label: "Library", icon: ResourcesIcon },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "oklch(30% 0.12 260)",
        borderTop: "1px solid oklch(97% 0.005 80 / 0.1)",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 100,
      }}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.75rem 0.5rem",
              textDecoration: "none",
              color: active ? "oklch(65% 0.15 45)" : "oklch(60% 0.04 260)",
              transition: "color 0.15s",
            }}
          >
            <Icon active={active} />
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function ResourcesIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function CommunityIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
