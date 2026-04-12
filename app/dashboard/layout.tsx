/** Server layout so segment config applies (ignored on client-only `page.tsx`). */
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
