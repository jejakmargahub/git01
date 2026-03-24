"use client";

import { useState } from "react";

interface UserAnalyticsData {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  totalDuration: number; // in seconds
  lastLogin: Date | null;
  lastPing: Date | null;
  lastLocation: string | null;
  lastIp: string | null;
}

interface UserAnalyticsProps {
  data: UserAnalyticsData[];
}

export default function UserAnalytics({ data }: UserAnalyticsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const isOnline = (lastPing: Date | null) => {
    if (!lastPing) return false;
    const now = new Date();
    const diff = now.getTime() - new Date(lastPing).getTime();
    return diff < 10 * 60 * 1000; // 10 menit
  };

  const filteredData = data.filter((u) => {
    const search = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search) ||
      u.phoneNumber?.toLowerCase().includes(search)
    );
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours}j ${minutes}m`;
  };

  const calculateMonthlyAverage = (totalSeconds: number, createdAt: Date) => {
    const created = new Date(createdAt);
    const now = new Date();
    const monthsDiff = Math.max(1, (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth()) + 1);
    const avgSeconds = totalSeconds / monthsDiff;
    return formatDuration(avgSeconds);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats summary for active users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Jam Penggunaan (Seluruh User)</p>
          <h3 className="text-3xl font-black text-primary">
            {formatDuration(data.reduce((acc, curr) => acc + curr.totalDuration, 0))}
          </h3>
        </div>
        <div className="card p-4 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">User Paling Aktif</p>
          <h3 className="text-xl font-bold truncate">
            {data.sort((a,b) => b.totalDuration - a.totalDuration)[0]?.fullName || "-"}
          </h3>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input 
          type="text" 
          placeholder="Cari User..." 
          className="input-field w-full pl-10 h-11 text-sm bg-white dark:bg-[#111]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Analytics Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#111]">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Pengguna</th>
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Total Pemakaian</th>
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Rerata/Bulan</th>
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Last Login</th>
              <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase">Lokasi Terakhir</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-[10px]">
                        {user.fullName[0].toUpperCase()}
                      </div>
                      {isOnline(user.lastPing) && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#111] rounded-full animate-pulse" title="Sedang Online" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-xs leading-tight">{user.fullName}</p>
                        {isOnline(user.lastPing) && (
                          <span className="text-[7px] font-bold text-green-500 uppercase tracking-tighter">Online</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted">{user.email || user.phoneNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                     <p className="text-xs font-bold text-primary">{formatDuration(user.totalDuration)}</p>
                     {/* Mini bar chart representation */}
                     <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-primary" 
                           style={{ width: `${Math.min(100, (user.totalDuration / Math.max(1, data.sort((a,b) => b.totalDuration - a.totalDuration)[0]?.totalDuration)) * 100)}%` }}
                        />
                     </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs font-medium">
                  {calculateMonthlyAverage(user.totalDuration, user.createdAt)}
                </td>
                <td className="px-5 py-4">
                  {user.lastLogin ? (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {new Date(user.lastLogin).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">Belum pernah login</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  {user.lastLocation ? (
                    <div className="flex flex-col">
                       <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">📍 {user.lastLocation}</p>
                       <p className="text-[10px] text-slate-400 font-mono">IP: {user.lastIp}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">-</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
