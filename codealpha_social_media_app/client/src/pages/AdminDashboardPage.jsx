import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import BottomNav from '../components/common/BottomNav';
import api from '../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 14200,
    activeUsersToday: 4820,
    totalPosts: 89400,
    totalSparks: 3200,
    flaggedPosts: 12,
    serverStatus: 'Operational',
    uptime: '99.98%'
  });
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      const usersRes = await api.get('/admin/users');
      if (usersRes.data.success) {
        setUsersList(usersRes.data.users);
      }
    } catch (err) {
      setUsersList([
        { _id: 'u1', name: 'Elena Rostova', username: 'elena_design', email: 'elena@vibely.app', role: 'admin', isVerified: true },
        { _id: 'u2', name: 'Marcus Chen', username: 'marcus_dev', email: 'marcus@vibely.app', role: 'user', isVerified: true },
        { _id: 'u3', name: 'Spam Bot 9000', username: 'bot_spammer', email: 'bot@spam.com', role: 'user', isVerified: false }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full space-y-6 pb-24 md:pb-8">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
            <div>
              <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                Admin Dashboard & Analytics
              </h1>
              <p className="text-xs text-outline">Manage platform health, moderation, and registered accounts.</p>
            </div>

            <span className="px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              {stats.serverStatus} ({stats.uptime})
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-surface-container-high shadow-sm space-y-1">
              <p className="text-xs text-outline font-medium">Total Registered Users</p>
              <p className="text-2xl font-extrabold text-on-surface">{stats.totalUsers.toLocaleString()}</p>
              <span className="text-[10px] text-green-600 font-semibold">+14.2% this month</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-surface-container-high shadow-sm space-y-1">
              <p className="text-xs text-outline font-medium">Active Users Today</p>
              <p className="text-2xl font-extrabold text-primary">{stats.activeUsersToday.toLocaleString()}</p>
              <span className="text-[10px] text-outline font-semibold">Peak: 5,120</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-surface-container-high shadow-sm space-y-1">
              <p className="text-xs text-outline font-medium">Published Posts</p>
              <p className="text-2xl font-extrabold text-on-surface">{stats.totalPosts.toLocaleString()}</p>
              <span className="text-[10px] text-green-600 font-semibold">+2,400 today</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-surface-container-high shadow-sm space-y-1">
              <p className="text-xs text-outline font-medium">Flagged for Moderation</p>
              <p className="text-2xl font-extrabold text-secondary">{stats.flaggedPosts}</p>
              <span className="text-[10px] text-secondary font-semibold">Action required</span>
            </div>
          </div>

          {/* User Management Table */}
          <div className="bg-white rounded-3xl p-6 border border-surface-container-high shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-on-surface">Registered User Directory</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-high text-outline uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 flex items-center gap-2.5 font-semibold text-on-surface">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-white font-bold flex items-center justify-center text-xs">
                          {u.name[0]}
                        </div>
                        <div>
                          <p>{u.name}</p>
                          <p className="text-[10px] text-outline font-normal">@{u.username}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-semibold">Active</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-xs text-primary font-semibold hover:underline">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
