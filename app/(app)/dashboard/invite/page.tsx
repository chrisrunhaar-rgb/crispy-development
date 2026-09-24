import { redirect } from "next/navigation";

// Invites now live in the Members section of Team Settings (numbered slots).
export default function DashboardInvitePage() {
  redirect("/dashboard/team-settings#members");
}
