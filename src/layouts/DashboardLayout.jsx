import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Code2,
  Briefcase,
  User,
  Users,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Manage Students', path: '/admin/students', icon: Users },
      ];
    } else {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'DSA Tracker', path: '/dsa', icon: Code2 },
        { name: 'Job Tracker', path: '/jobs', icon: Briefcase },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    }
  };

  const links = getLinks();

  return (
    <div className="min-h-screen flex bg-darkblue-950 text-darkblue-100">
      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center justify-between w-full h-16 px-4 bg-darkblue-900 border-b border-darkblue-800/80 fixed top-0 left-0 z-40">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary-400" />
          <span className="font-semibold text-lg tracking-wide bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
            CareerTracker
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-darkblue-300 hover:text-white focus:outline-none"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-darkblue-900/95 backdrop-blur-md lg:backdrop-blur-none border-r border-darkblue-850 p-5 flex flex-col justify-between transition-transform duration-350 z-50 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 py-2 border-b border-darkblue-800">
            <GraduationCap className="h-8 w-8 text-primary-500" />
            <div>
              <h1 className="font-bold text-base leading-tight tracking-wide bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
                CareerTracker
              </h1>
              <span className="text-[10px] text-darkblue-400 font-semibold tracking-wider uppercase block">
                {user?.role} Access
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              // Active matching: strict matching for root dashboard path, starts-with for subpaths
              const isActive = (link.path === '/admin' || link.path === '/dashboard') 
                ? location.pathname === link.path 
                : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium transition-all duration-200 group text-sm ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'text-darkblue-450 hover:text-darkblue-100 hover:bg-darkblue-800/40'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-105 duration-200 ${
                    isActive ? 'text-white' : 'text-darkblue-400 group-hover:text-primary-400'
                  }`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Summary Card */}
        <div className="flex flex-col gap-4 border-t border-darkblue-850 pt-5">
          <div className="flex items-center gap-3 px-1.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center font-bold text-sm text-white shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-darkblue-150 truncate leading-tight">{user?.name}</p>
              <p className="text-[10px] text-darkblue-400 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl font-medium text-xs text-rose-450 hover:bg-rose-950/20 hover:text-rose-350 transition-all duration-200 focus:outline-none"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
