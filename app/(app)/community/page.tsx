import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import PostDiscussionForm from "@/components/PostDiscussionForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Community — Crispy Development",
  description: "Discuss, share, and grow with other cross-cultural leaders.",
};

type DiscussionPost = {
  id: string;
  user_id: string;
  user_name: string | null;
  content: string;
  module_id: string | null;
  parent_id: string | null;
  created_at: string;
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/community");

  const { module: moduleSlug } = await searchParams;
  const admin = createAdminClient();

  // Fetch modules for the filter bar
  const { data: modules } = await supabase
    .from("modules")
    .select("id, slug, title, is_free, order_index")
    .order("order_index");

  // Determine active module
  const activeModule = moduleSlug
    ? (modules ?? []).find(m => m.slug === moduleSlug)
    : null;

  // Fetch top-level posts (parent_id is null)
  let query = admin
    .from("discussions")
    .select("*")
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (activeModule) {
    query = query.eq("module_id", activeModule.id);
  } else {
    // All community posts (not module-specific)
    query = query.is("module_id", null);
  }

  const { data: posts } = await query;
  const topPosts: DiscussionPost[] = (posts ?? []) as DiscussionPost[];

  // Fetch reply counts per post
  const postIds = topPosts.map(p => p.id);
  let replyCounts = new Map<string, number>();
  if (postIds.length > 0) {
    const { data: replies } = await admin
      .from("discussions")
      .select("parent_id")
      .in("parent_id", postIds);
    (replies ?? []).forEach((r: { parent_id: string }) => {
      replyCounts.set(r.parent_id, (replyCounts.get(r.parent_id) ?? 0) + 1);
    });
  }

  const firstName = user.user_metadata?.first_name ?? user.email?.split("@")[0] ?? "there";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 120px)" }}>

      {/* Header */}
      <div style={{ background: "oklch(30% 0.12 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>Community</p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              Discussion Space
            </h1>
          </div>
          <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(88% 0.008 80)", textDecoration: "none" }}>
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "3rem", alignItems: "start" }}>

          {/* Sidebar — module filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <Link
              href="/community"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                fontWeight: !activeModule ? 700 : 500,
                color: !activeModule ? "oklch(30% 0.12 260)" : "oklch(52% 0.008 260)",
                textDecoration: "none",
                padding: "0.625rem 0.875rem",
                background: !activeModule ? "oklch(30% 0.12 260 / 0.07)" : "transparent",
              }}
            >
              General Discussion
            </Link>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.008 260)", padding: "1rem 0.875rem 0.375rem" }}>
              By module
            </p>
            {(modules ?? []).map(mod => (
              <Link
                key={mod.id}
                href={`/community?module=${mod.slug}`}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8125rem",
                  fontWeight: activeModule?.id === mod.id ? 700 : 500,
                  color: activeModule?.id === mod.id ? "oklch(30% 0.12 260)" : "oklch(52% 0.008 260)",
                  textDecoration: "none",
                  padding: "0.625rem 0.875rem",
                  background: activeModule?.id === mod.id ? "oklch(30% 0.12 260 / 0.07)" : "transparent",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>{mod.title}</span>
                {!mod.is_free && <span style={{ fontSize: "0.6rem", color: "oklch(65% 0.15 45)" }}>🔒</span>}
              </Link>
            ))}
          </div>

          {/* Main content */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: "oklch(22% 0.005 260)" }}>
                  {activeModule ? activeModule.title : "General Discussion"}
                </h2>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(55% 0.008 260)", marginTop: "0.25rem" }}>
                  {topPosts.length} {topPosts.length === 1 ? "post" : "posts"}
                </p>
              </div>
            </div>

            {/* Post form */}
            <div style={{ marginBottom: "2.5rem", background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.875rem" }}>
                Share a thought, {firstName}
              </p>
              <PostDiscussionForm
                moduleId={activeModule?.id ?? null}
                userName={`${user.user_metadata?.first_name ?? ""} ${user.user_metadata?.last_name ?? ""}`.trim() || (user.email ?? "Member")}
              />
            </div>

            {/* Posts */}
            {topPosts.length === 0 ? (
              <div style={{ padding: "3rem 2rem", textAlign: "center", background: "oklch(96% 0.004 80)", border: "1px solid oklch(88% 0.008 80)" }}>
                <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(52% 0.008 260)", marginBottom: "0.75rem" }}>
                  &ldquo;Be the first to start the conversation.&rdquo;
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(55% 0.008 260)" }}>
                  No posts yet in this space.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                {topPosts.map(post => (
                  <div key={post.id} style={{ background: "white", padding: "1.5rem 2rem" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{
                        width: "32px", height: "32px", flexShrink: 0,
                        background: "oklch(30% 0.12 260)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", color: "oklch(97% 0.005 80)" }}>
                          {(post.user_name ?? "?")[0].toUpperCase()}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: "oklch(30% 0.12 260)" }}>
                            {post.user_name ?? "Community Member"}
                          </p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.008 260)" }}>
                            {formatRelativeTime(post.created_at)}
                          </p>
                        </div>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(32% 0.008 260)" }}>
                          {post.content}
                        </p>
                        {(replyCounts.get(post.id) ?? 0) > 0 && (
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(65% 0.15 45)", marginTop: "0.625rem", fontWeight: 600 }}>
                            {replyCounts.get(post.id)} {replyCounts.get(post.id) === 1 ? "reply" : "replies"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
