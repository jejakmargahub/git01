"use client";

import { useState } from "react";
import { updateUserStatus } from "@/lib/actions/admin";

interface UserStats {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  role: string;
  status: string;
  createdAt: Date;
  ownedFamiliesCount: number;
  accessedFamiliesCount: number;
}

interface UserManagementProps {
  initialUsers: UserStats[];
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const search = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search) ||
      u.phoneNumber?.toLowerCase().includes(search)
    );
  });

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "disabled" : "active";
    if (!confirm(`Yakin ingin ${newStatus === "active" ? "mengaktifkan" : "menonaktifkan"} akun ini?`)) return;

    setLoadingId(userId);
    try {
      await updateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      alert("Gagal memperbarui status: " + (err instanceof Error ? err.message : "Kesalahan tidak diketahui"));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cards & Controls Row */}
      <div className="flex flex-col gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-primary p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total User</p>
            <h3 className="text-2xl font-bold">{users.length}</h3>
          </div>
          <div className="text-3xl opacity-20">👥</div>
        </div>
        <div className="card border-l-4 border-l-green-500 p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User Aktif</p>
            <h3 className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</h3>
          </div>
          <div className="text-3xl opacity-20">✅</div>
        </div>
        <div className="card border-l-4 border-l-red-500 p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nonaktif</p>
            <h3 className="text-2xl font-bold">{users.filter(u => u.status === 'disabled').length}</h3>
          </div>
          <div className="text-3xl opacity-20">🚫</div>
        </div>
        <div className="card border-l-4 border-l-amber-500 p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Super Admin</p>
            <h3 className="text-2xl font-bold">{users.filter(u => u.role === 'superadmin').length}</h3>
          </div>
          <div className="text-3xl opacity-20">🛡️</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#111] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Cari Nama, Email, atau HP..." 
            className="input-field w-full pl-10 h-10 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <button className="btn btn-secondary text-xs px-4 py-2 border-slate-200 dark:border-slate-700">Refresh</button>
           <button className="btn btn-secondary text-xs px-4 py-2 border-slate-200 dark:border-slate-700">Ekspor CSV</button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#111]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Pengguna</th>
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Peran</th>
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Stats</th>
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Terdaftar</th>
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Status</th>
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                      {user.fullName[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-tight">{user.fullName}</p>
                      <p className="text-[11px] text-muted">{user.email || user.phoneNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    user.role === 'superadmin' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    🏠 {user.ownedFamiliesCount} Pemilik
                  </p>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    🔑 {user.accessedFamiliesCount} Akses
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-[11px] text-slate-500">{new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                    user.status === 'active' ? 'text-green-600' : 'text-danger'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {user.status === 'active' ? 'Aktif' : 'Dinonaktifkan'}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => handleToggleStatus(user.id, user.status)}
                    disabled={loadingId === user.id}
                    className={`btn text-xs px-3 py-1.5 rounded-lg font-bold border-2 ${
                      user.status === 'active' 
                        ? 'border-red-100 text-danger hover:bg-red-50 dark:border-red-900/20' 
                        : 'border-green-100 text-green-600 hover:bg-green-50 dark:border-green-900/20'
                    }`}
                  >
                    {loadingId === user.id ? '...' : user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted text-sm italic">Hasil pencarian "{searchTerm}" tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
