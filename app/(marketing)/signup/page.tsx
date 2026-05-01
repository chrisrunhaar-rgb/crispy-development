import SignupForm from "./SignupForm";

export const metadata = {
  title: "Get Started — Crispy Development",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ pathway?: string; invite?: string; member_invite?: string }>;
}) {
  const { pathway, invite, member_invite } = await searchParams;
  return (
    <SignupForm
      defaultPathway={pathway === "team" ? "team" : "personal"}
      inviteToken={invite ?? ""}
      memberInviteToken={member_invite ?? ""}
    />
  );
}
