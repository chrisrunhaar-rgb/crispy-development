import { redirect } from "next/navigation";

export const metadata = {
  title: "Pricing — Crispy Leaders",
  description: "Monthly or annual access to all Crispy Leaders resources, pathways, and AI coaching.",
};

export default function MembershipPage() {
  redirect("/pricing");
}
