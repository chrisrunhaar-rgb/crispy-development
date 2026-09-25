import { redirect } from "next/navigation";

// The stone path was replaced by the iceberg map. Old links to /journey land there.
export default function JourneyPage() {
  redirect("/journey/iceberg");
}
