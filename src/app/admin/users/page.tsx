import { getAllUsers } from "@/lib/actions/admin";
import UserManagement from "./UserManagement";

export const metadata = {
  title: "Manajemen User | Dashboard Super Admin",
};

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          Monitoring Akun Terdaftar
        </h1>
        <p className="text-sm text-muted">
          Kelola seluruh pengguna Jejak Marga, pantau statistik, dan atur akses akun secara global.
        </p>
      </div>

      <UserManagement initialUsers={users} />
    </div>
  );
}
