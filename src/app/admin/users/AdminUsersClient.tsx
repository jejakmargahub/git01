"use client";

import { useState } from "react";
import UserManagement from "./UserManagement";
import UserAnalytics from "./UserAnalytics";

interface AdminUsersClientProps {
  initialUsers: any[];
  analyticsData: any[];
}

export default function AdminUsersClient({ initialUsers, analyticsData }: AdminUsersClientProps) {
  const [activeTab, setActiveTab] = useState<"management" | "analytics">("management");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          Super Admin Panel [v2.0 Update] 🛡️
        </h1>
        <p className="text-sm text-muted">
          Monitoring akun, statistik penggunaan, dan keamanan global.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("management")}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === "management" 
              ? "border-primary text-primary" 
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Tab 1: Manajemen Pengguna
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === "analytics" 
              ? "border-primary text-primary" 
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Tab 2: Analitik & Keamanan
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "management" ? (
          <UserManagement initialUsers={initialUsers} />
        ) : (
          <UserAnalytics data={analyticsData} />
        )}
      </div>
    </div>
  );
}
