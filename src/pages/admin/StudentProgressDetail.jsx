import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Code2,
  Briefcase,
  Calendar,
  GraduationCap,
  Loader2,
  FileText,
  AlertCircle,
  Clock
} from 'lucide-react';

const StudentProgressDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        const res = await api.get(`/api/admin/students/${id}/progress`);
        if (res.data && res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load student progress logs');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentProgress();
  }, [id]);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-950/50 text-emerald-450 border border-emerald-900/40 rounded-full">Easy</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-950/50 text-amber-450 border border-amber-900/40 rounded-full">Medium</span>;
      case 'Hard':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-950/50 text-rose-455 border border-rose-900/40 rounded-full">Hard</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-950/50 text-blue-450 border border-blue-900/40 rounded-full">Applied</span>;
      case 'OA Cleared':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-950/50 text-purple-450 border border-purple-900/40 rounded-full">OA Cleared</span>;
      case 'Interview Scheduled':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-950/50 text-amber-400 border border-amber-900/40 rounded-full">Interview</span>;
      case 'Selected':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-950/50 text-emerald-450 border border-emerald-900/40 rounded-full">Selected</span>;
      case 'Rejected':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-950/50 text-rose-455 border border-rose-900/40 rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-darkblue-800 text-darkblue-300 rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          <p className="text-darkblue-400 font-medium">Assembling candidate archives...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center flex flex-col items-center gap-4 text-darkblue-400">
        <AlertCircle className="h-10 w-10 text-rose-455" />
        <p className="font-semibold text-white">Candidate profile not found</p>
        <Link to="/admin/students" className="text-xs text-primary-400 hover:underline">
          Return to Student Directory
        </Link>
      </div>
    );
  }

  const { student, dsaProgress, jobApplications } = data;

  // Calculate aggregates
  const totalSolved = dsaProgress.reduce((acc, curr) => acc + curr.solvedQuestions, 0);
  const totalJobs = jobApplications.length;
  const interviewCount = jobApplications.filter((j) => j.status === 'Interview Scheduled').length;
  const profileCompletion = 40 + (dsaProgress.length > 0 ? 30 : 0) + (jobApplications.length > 0 ? 30 : 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <div>
        <Link
          to="/admin/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-darkblue-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 duration-200" />
          <span>Back to Students</span>
        </Link>

        {/* Title details banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-darkblue-850 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center font-bold text-lg text-white shadow-sm">
              {student.name[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{student.name}</h2>
              <p className="text-xs text-darkblue-400 mt-1">{student.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-darkblue-450">Registered:</span>
            <span className="text-xs font-semibold text-darkblue-200">
              {new Date(student.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-darkblue-400 tracking-wider">DSA Solved</p>
          <p className="text-2xl font-extrabold text-white mt-1">{totalSolved}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-darkblue-400 tracking-wider">Job Pipeline</p>
          <p className="text-2xl font-extrabold text-white mt-1">{totalJobs}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Interviews</p>
          <p className="text-2xl font-extrabold text-white mt-1">{interviewCount}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-emerald-450 tracking-wider">Profile Score</p>
          <p className="text-2xl font-extrabold text-white mt-1">{profileCompletion}%</p>
        </div>
      </div>

      {/* Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        {/* Left: Candidate DSA Tracker */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-bold text-base text-white border-b border-darkblue-800 pb-3 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary-400" />
            <span>DSA Tracker Progress</span>
          </h3>

          {dsaProgress.length === 0 ? (
            <div className="py-12 text-center text-darkblue-450 text-sm">
              This candidate has not logged any DSA progress.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {dsaProgress.map((rec) => {
                const pct = Math.round((rec.solvedQuestions / rec.totalQuestions) * 100) || 0;
                return (
                  <div
                    key={rec._id}
                    className="p-4 bg-darkblue-950/40 border border-darkblue-850 rounded-xl flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-darkblue-100 text-sm">{rec.topicName}</h4>
                      {getDifficultyBadge(rec.difficulty)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-darkblue-400">Solved rate:</span>
                        <span className="font-bold text-darkblue-250">
                          {rec.solvedQuestions} / {rec.totalQuestions} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-darkblue-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                    {rec.notes && (
                      <p className="text-[11px] text-darkblue-300 mt-1 leading-relaxed bg-darkblue-900/30 p-2 rounded-lg border border-darkblue-800/40">
                        {rec.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Job Application list */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-bold text-base text-white border-b border-darkblue-800 pb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-400" />
            <span>Job Applications Tracker</span>
          </h3>

          {jobApplications.length === 0 ? (
            <div className="py-12 text-center text-darkblue-450 text-sm">
              This candidate has not logged any job applications.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {jobApplications.map((job) => (
                <div
                  key={job._id}
                  className="p-4 bg-darkblue-950/40 border border-darkblue-850 rounded-xl flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-darkblue-100 text-sm">{job.companyName}</h4>
                      <p className="text-[11px] text-darkblue-400 mt-0.5">{job.role}</p>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-darkblue-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-darkblue-500" />
                      Applied: {new Date(job.applicationDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-darkblue-500" />
                      Updated: {new Date(job.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {job.notes && (
                    <div className="mt-2 text-xs text-darkblue-300 bg-darkblue-900/30 p-2.5 rounded-lg border border-darkblue-800/40 flex items-start gap-2">
                      <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{job.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressDetail;
