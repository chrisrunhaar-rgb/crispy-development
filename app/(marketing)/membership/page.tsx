import { redirect } from "next/navigation";

export const metadata = {
  title: "Pricing — Crispy Leaders",
  description: "One payment, lifetime access to all Crispy Leaders resources, pathways, and AI coaching.",
};

export default function MembershipPage() {
  redirect("/pricing");
}
