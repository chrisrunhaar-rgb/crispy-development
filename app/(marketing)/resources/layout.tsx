import ScrollTracker from "@/components/ScrollTracker";

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollTracker />
    </>
  );
}
