import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Code2,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="relative min-h-screen bg-darkblue-950 text-darkblue-100 overflow-hidden flex flex-col justify-between">
      {/* Background radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-glow-purple pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-glow-indigo pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="h-8 w-8 text-primary-500" />
          <span className="font-bold text-xl tracking-wider bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
            CareerTracker
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to={user?.role === 'admin' ? '/admin' : '/dashboard'}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary-600/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-darkblue-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary-600/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-12 lg:py-24 flex-1 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-950/40 border border-primary-800/40 text-primary-400 text-xs font-semibold self-center lg:self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping"></span>
            Empowering Placement aspirants
          </div>
          <h2 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white">
            Supercharge Your <br />
            <span className="bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Placement Prep
            </span>
          </h2>
          <p className="text-darkblue-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Consolidate your DSA logs and job applications in one visual interface. Track statistics, monitor status changes, and stay prepared for upcoming recruitment drives.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-4">
            <Link
              to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/register'}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 group"
            >
              <span>Start Tracking Now</span>
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1 duration-200" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 bg-darkblue-900/40 border border-darkblue-800 hover:border-darkblue-700 text-darkblue-200 hover:text-white font-semibold rounded-xl transition-all text-center"
            >
              Sign In to Account
            </Link>
          </div>
        </div>

        {/* Hero Features Grid */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card-interactive p-6 rounded-2xl flex flex-col gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-950/60 flex items-center justify-center border border-primary-850">
              <Code2 className="h-5 w-5 text-primary-400" />
            </div>
            <h3 className="font-bold text-lg text-white">DSA Logger</h3>
            <p className="text-xs text-darkblue-400 leading-relaxed">
              Track questions solved per topic, filter by difficulty (Easy, Medium, Hard), and write key takeaways or notes for revision.
            </p>
          </div>

          <div className="glass-card-interactive p-6 rounded-2xl flex flex-col gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-950/60 flex items-center justify-center border border-indigo-850">
              <Briefcase className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg text-white">Job Pipeline</h3>
            <p className="text-xs text-darkblue-400 leading-relaxed">
              Log applications, filter progress stages (OA, Interview, Rejected, Selected), and stay on top of recruitment schedules.
            </p>
          </div>

          <div className="glass-card-interactive p-6 rounded-2xl flex flex-col gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-950/60 flex items-center justify-center border border-emerald-850">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-lg text-white">Interactive Progress</h3>
            <p className="text-xs text-darkblue-400 leading-relaxed">
              Automatically calculate profile completion percentage, solve rates, upcoming interview timelines, and keep momentum going.
            </p>
          </div>

          <div className="glass-card-interactive p-6 rounded-2xl flex flex-col gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-950/60 flex items-center justify-center border border-purple-850">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-lg text-white">Admin Controls</h3>
            <p className="text-xs text-darkblue-400 leading-relaxed">
              Enable placement coordinators to oversee student registries, view summaries of problem-solving metrics, and check pipeline statuses.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-darkblue-900 bg-darkblue-950/80 py-6 text-center">
        <p className="text-xs text-darkblue-500">
          &copy; {new Date().getFullYear()} Student Career Tracker (MVP). All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
