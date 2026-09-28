import { getAllWorkersForAdmin, getAnalyticsMetrics } from "@/app/actions/worker";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const allWorkers = await getAllWorkersForAdmin();
  const metrics = await getAnalyticsMetrics();

  // Next.js cannot pass Date objects directly to Client Components, so we stringify/parse
  const safeWorkers = JSON.parse(JSON.stringify(allWorkers));

  return <AdminClient initialWorkers={safeWorkers} metrics={metrics} />;
}
