import { AdminDashboard } from "@/components/AdminDashboard";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return <AdminDashboard restaurantName={session.name} />;
}
