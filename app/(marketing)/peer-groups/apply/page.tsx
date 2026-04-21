import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PeerGroupApplicationForm from "@/components/PeerGroupApplicationForm";

export const metadata = {
  title: "Initiate a Peer Group — Crispy Development",
};

export default async function PeerGroupApplyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/peer-groups/apply");

  // Check existing application
  const { data: existing } = await supabase
    .from("peer_group_applications")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.status === "approved") redirect("/dashboard");

  const firstName = user.user_metadata?.first_name ?? "";

  return (
    <>
      <section style={{ background: "oklch(30% 0.12 260)", paddingTop: "clamp(4rem, 7vw, 7rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide">
          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "18ch" }}>
            Ready to start{firstName ? `, ${firstName}?` : "?"}
          </h1>
          <p className="t-tagline" style={{ color: "oklch(78% 0.04 260)", maxWidth: "44ch" }}>
            Tell us about your context. If it&apos;s a good fit, we&apos;ll approve your application and give you everything you need to launch.
          </p>
        </div>
      </section>

      {existing?.status === "pending" ? (
        <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
          <div className="container-wide">
            <div style={{ maxWidth: "540px", padding: "3rem 2.5rem", background: "white", border: "1px solid oklch(88% 0.008 80)" }}>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Application In Review</p>
              <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.4rem", color: "oklch(22% 0.005 260)", marginBottom: "1rem" }}>
                You&apos;re on the list{firstName ? `, ${firstName}` : ""}.
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)" }}>
                Your application is being reviewed. Chris will be in touch soon.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
          <div className="container-wide">
            <PeerGroupApplicationForm />
          </div>
        </section>
      )}
    </>
  );
}
