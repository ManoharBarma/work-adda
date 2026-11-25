import { getReportsForAdmin } from "@/app/actions/report";
import ReportsClient from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await getReportsForAdmin();
  const safeReports = JSON.parse(JSON.stringify(reports));

  return <ReportsClient initialReports={safeReports} />;
}
