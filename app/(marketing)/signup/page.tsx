import SignupForm from "./SignupForm";

export const metadata = {
  title: "Get Started — Crispy Development",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ pathway?: string; invite?: string }>;
}) {
  const { pathway, invite } = await searchParams;
  return (
    <SignupForm
      defaultPathway={pathway === "team" ? "team" : "personal"}
      inviteToken={invite ?? ""}
    />
  );
}
