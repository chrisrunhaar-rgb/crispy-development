import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const initialFirstName = user
    ? (user.user_metadata?.first_name ?? user.email?.split("@")[0] ?? "Me")
    : null;

  return (
    <>
      <Nav initialFirstName={initialFirstName} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
