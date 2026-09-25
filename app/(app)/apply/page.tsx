import { redirect } from "next/navigation";

// The Team Leader application flow is retired: teams are set up by buying the
// Team plan on /pricing.
export default function ApplyPage() {
  redirect("/pricing");
}
