import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Code2,
  Briefcase,
  Calendar,
  CheckCircle,
  PlusCircle,
  TrendingUp,
  ArrowUpRight,
  Loader2
} from 'lucide-react';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSolved: 0,
    totalApplications: 0,
    upcomingInterviews: 0,
    profileCompletion: 40,
    recentDsa: [],
    recentJobs: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dsaRes, jobsRes] = await Promise.all([
          api.get('/api/dsa'),
          api.get('/api/jobs'),
        ]);

        const dsaRecords = dsaRes.data.data;
        const jobRecords = jobsRes.data.data;

        // Calculate statistics
        const totalSolved = dsaRecords.reduce((acc, curr) => acc + curr.solvedQuestions, 0);
        const totalApplications = jobRecords.length;
        const upcomingInterviews = jobRecords.filter(job => job.status === 'Interview Scheduled').length;

        // Calculate Profile Completion % (Base 40%, +30% for DSA record, +30% for Job record)
        let profileCompletion = 40;
        if (dsaRecords.length > 0) profileCompletion += 30;
        if (jobRecords.length > 0) profileCompletion += 30;

        setStats({
          totalSolved,
          totalApplications,
          upcomingInterviews,
          profileCompletion,
          recentDsa: dsaRecords.slice(0, 5),
          recentJobs: jobRecords.slice(0, 5),
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error.message);
        toast.error('Could not fetch latest statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 rounded-full">Easy</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-950/50 text-amber-400 border border-amber-800/40 rounded-full">Medium</span>;
      case 'Hard':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-950/50 text-rose-400 border border-rose-800/40 rounded-full">Hard</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-950/50 text-blue-400 border border-blue-800/40 rounded-full">Applied</span>;
      case 'OA Cleared':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-950/50 text-purple-400 border border-purple-800/40 rounded-full">OA Cleared</span>;
      case 'Interview Scheduled':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-950/50 text-amber-450 border border-amber-800/40 rounded-full">Interview</span>;
      case 'Selected':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 rounded-full">Selected</span>;
      case 'Rejected':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-950/50 text-rose-450 border border-rose-800/40 rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-darkblue-800 text-darkblue-300 rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          <p className="text-darkblue-400 font-medium">Assembling your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Student Dashboard</h2>
          <p className="text-sm text-darkblue-405 mt-1">Keep track of your placement milestones and prepare efficiently.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dsa/add"
            className="flex items-center gap-2 px-4 py-2 bg-darkblue-900 border border-darkblue-800 hover:border-darkblue-700 text-darkblue-100 rounded-xl text-sm font-semibold transition-all"
          >
            <PlusCircle className="h-4 w-4 text-primary-400" />
            <span>Add DSA Log</span>
          </Link>
          <Link
            to="/jobs"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-600/10"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Job Application</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="glass-card-interactive p-6 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase text-darkblue-400 tracking-wider">DSA Solved</span>
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.totalSolved}</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> Combined Count
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary-950/40 border border-primary-900/50 flex items-center justify-center text-primary-400">
            <Code2 className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card-interactive p-6 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase text-darkblue-400 tracking-wider">Job Applications</span>
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.totalApplications}</span>
            <span className="text-[10px] text-indigo-400 flex items-center gap-1 mt-1">
              Active Pipelines
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-950/40 border border-indigo-900/50 flex items-center justify-center text-indigo-400">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card-interactive p-6 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase text-darkblue-400 tracking-wider">Interviews Scheduled</span>
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.upcomingInterviews}</span>
            <span className="text-[10px] text-amber-400 flex items-center gap-1 mt-1">
              Preparation Required
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-950/40 border border-amber-900/50 flex items-center justify-center text-amber-400">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card-interactive p-6 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase text-darkblue-400 tracking-wider">Profile Strength</span>
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.profileCompletion}%</span>
            <div className="w-24 bg-darkblue-900 rounded-full h-1.5 mt-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-indigo-500 h-1.5 rounded-full"
                style={{ width: `${stats.profileCompletion}%` }}
              ></div>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Two Columns Grid for Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DSA Progress Recents */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-darkblue-800">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary-400" />
              <span>Recent DSA Activity</span>
            </h3>
            <Link to="/dsa" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-0.5">
              <span>View All</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.recentDsa.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center gap-2 text-darkblue-400 text-sm">
              <p>No DSA progress records found.</p>
              <Link to="/dsa/add" className="text-xs text-primary-400 hover:underline">Add your first record</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-darkblue-400 border-b border-darkblue-850">
                    <th className="py-2.5">Topic</th>
                    <th className="py-2.5">Difficulty</th>
                    <th className="py-2.5 text-right">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkblue-850 text-darkblue-200">
                  {stats.recentDsa.map((rec) => (
                    <tr key={rec._id} className="hover:bg-darkblue-900/20">
                      <td className="py-3 font-semibold text-darkblue-100">{rec.topicName}</td>
                      <td className="py-3">{getDifficultyBadge(rec.difficulty)}</td>
                      <td className="py-3 text-right font-medium">
                        {rec.solvedQuestions} / {rec.totalQuestions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Job Applications Recents */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-darkblue-800">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-400" />
              <span>Recent Job Applications</span>
            </h3>
            <Link to="/jobs" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-0.5">
              <span>View Pipeline</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.recentJobs.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center gap-2 text-darkblue-400 text-sm">
              <p>No job application logs found.</p>
              <Link to="/jobs" className="text-xs text-primary-400 hover:underline">Track your first job</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-darkblue-400 border-b border-darkblue-850">
                    <th className="py-2.5">Company</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkblue-850 text-darkblue-200">
                  {stats.recentJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-darkblue-900/20">
                      <td className="py-3 font-semibold text-darkblue-100">{job.companyName}</td>
                      <td className="py-3 text-darkblue-300">{job.role}</td>
                      <td className="py-3 text-right">{getStatusBadge(job.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
