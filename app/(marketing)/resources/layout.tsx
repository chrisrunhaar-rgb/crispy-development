import ScrollTracker from "@/components/ScrollTracker";
import { ResourceViewTracker } from "@/components/ResourceViewTracker";

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollTracker />
      <ResourceViewTracker />
    </>
  );
}
