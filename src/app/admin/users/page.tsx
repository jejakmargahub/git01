import { getAllUsers, getUserAnalytics } from "@/lib/actions/admin";
import AdminUsersClient from "./AdminUsersClient";

export const metadata = {
  title: "Admin Panel | Monitoring & Analitik",
};

export default async function AdminUsersPage() {
  const [users, analytics] = await Promise.all([
    getAllUsers(),
    getUserAnalytics(),
  ]);

  return (
    <AdminUsersClient 
      initialUsers={users} 
      analyticsData={analytics} 
    />
  );
}
