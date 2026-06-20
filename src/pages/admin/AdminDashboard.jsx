import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Users,
  Briefcase,
  Code2,
  Calendar,
  UserCheck,
  ArrowRight,
  Loader2,
  GraduationCap
} from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalApplications: 0,
    totalDsaRecords: 0,
    recentRegistrations: [],
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load administrator statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          <p className="text-darkblue-400 font-medium">Assembling admin statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Title block */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Coordinator Console</h2>
          <p className="text-sm text-darkblue-400 mt-1">Aggregated placement progress metrics for Student Career Tracker.</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="glass-card-interactive p-6 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase text-darkblue-400 tracking-wider">Total Students</span>
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.totalStudents}</span>
            <span className="text-[10px] text-primary-400 mt-1">Registered & Tracked</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary-950/40 border border-primary-900/50 flex items-center justify-center text-primary-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card-interactive p-6 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase text-darkblue-400 tracking-wider">Logged Applications</span>
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.totalApplications}</span>
            <span className="text-[10px] text-indigo-400 mt-1">Combined job tracker logs</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-950/40 border border-indigo-900/50 flex items-center justify-center text-indigo-400">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card-interactive p-6 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase text-darkblue-400 tracking-wider">DSA records logged</span>
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.totalDsaRecords}</span>
            <span className="text-[10px] text-emerald-400 mt-1">Topic solve sets</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center text-emerald-400">
            <Code2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col gap-5">
          <div className="flex justify-between items-center pb-2 border-b border-darkblue-800">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-400" />
              <span>Recent Registrations</span>
            </h3>
            <Link
              to="/admin/students"
              className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-0.5"
            >
              <span>Manage Students</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.recentRegistrations.length === 0 ? (
            <div className="py-12 text-center text-darkblue-450 text-sm">
              No registered students found yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-darkblue-400 border-b border-darkblue-850">
                    <th className="py-2.5">Student Name</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5">Date Registered</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkblue-850 text-darkblue-200">
                  {stats.recentRegistrations.map((student) => (
                    <tr key={student._id} className="hover:bg-darkblue-900/20 group">
                      <td className="py-3 font-semibold text-darkblue-100 flex items-center gap-2">
                        <div className="h-7 w-7 rounded bg-primary-950 border border-primary-850 text-primary-400 flex items-center justify-center font-bold text-[10px]">
                          {student.name[0].toUpperCase()}
                        </div>
                        <span>{student.name}</span>
                      </td>
                      <td className="py-3 text-darkblue-300">{student.email}</td>
                      <td className="py-3 text-darkblue-400">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/admin/students?studentId=${student._id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-450 hover:text-primary-350 transition-colors"
                        >
                          <span>View Progress</span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Info Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-base text-white border-b border-darkblue-800 pb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary-400" />
              <span>Placement Tracker</span>
            </h3>
            <p className="text-xs text-darkblue-300 leading-relaxed">
              As a Coordinator, you can audit the performance of placement drive candidates. 
            </p>
            <p className="text-xs text-darkblue-305 leading-relaxed">
              Use the student list to find specific records, check solved DSA counts, and review application interview logs.
            </p>
          </div>

          <Link
            to="/admin/students"
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-center shadow-lg shadow-primary-600/10 text-xs flex items-center justify-center gap-2"
          >
            <span>Launch Student Manager</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
