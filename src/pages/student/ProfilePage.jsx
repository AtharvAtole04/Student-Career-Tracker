import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Shield,
  CheckCircle2,
  Circle,
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [checkingStats, setCheckingStats] = useState(false);
  const [checklist, setChecklist] = useState({
    hasDsa: false,
    hasJob: false,
  });

  useEffect(() => {
    const loadChecklistStats = async () => {
      if (user?.role !== 'student') return;
      setCheckingStats(true);
      try {
        const [dsaRes, jobsRes] = await Promise.all([
          api.get('/api/dsa'),
          api.get('/api/jobs'),
        ]);
        setChecklist({
          hasDsa: dsaRes.data.data.length > 0,
          hasJob: jobsRes.data.data.length > 0,
        });
      } catch (error) {
        console.error('Error fetching profile checklist stats:', error);
      } finally {
        setCheckingStats(false);
      }
    };

    loadChecklistStats();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const { name, password, confirmPassword } = formData;

    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const updatePayload = { name: name.trim() };

    if (password) {
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      updatePayload.password = password;
    }

    setLoading(true);
    try {
      await api.put('/api/auth/profile', updatePayload);
      toast.success('Profile details updated successfully');
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
      // Optionally reload window to sync with context or display message
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Profile completion score
  const score = 40 + (checklist.hasDsa ? 30 : 0) + (checklist.hasJob ? 30 : 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Your Profile</h2>
        <p className="text-sm text-darkblue-400 mt-1">Manage credentials and track profile completion requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Profile Details form */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
          <h3 className="font-bold text-base text-white border-b border-darkblue-800 pb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-400" />
            <span>Profile Information</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-darkblue-500 pointer-events-none">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="form-input pl-10"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="form-label" htmlFor="email">
                Email Address (ReadOnly)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-darkblue-500 pointer-events-none">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled
                  className="form-input pl-10 opacity-60 cursor-not-allowed bg-darkblue-950"
                  value={formData.email}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="form-label" htmlFor="role">
                Account Role
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-darkblue-500 pointer-events-none">
                  <Shield className="h-4.5 w-4.5" />
                </span>
                <input
                  id="role"
                  name="role"
                  type="text"
                  disabled
                  className="form-input pl-10 capitalize opacity-60 cursor-not-allowed bg-darkblue-950"
                  value={formData.role}
                />
              </div>
            </div>

            {/* Password Update fields */}
            <div className="border-t border-darkblue-850 pt-5 mt-3 flex flex-col gap-4">
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-white">Update Password</h4>
                <p className="text-xs text-darkblue-400 mt-1">Leave blank if you do not wish to change the password.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="form-label" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-darkblue-500 pointer-events-none">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-input pl-9"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-darkblue-500 pointer-events-none">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="form-input pl-9"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-fit self-end mt-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-850 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-primary-600/10 transition-all text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Profile completion statistics */}
        {user?.role === 'student' && (
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
            <h3 className="font-bold text-base text-white border-b border-darkblue-800 pb-3">
              Profile Strength
            </h3>

            {checkingStats ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Circular indicator mock */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-darkblue-900 border-4 border-darkblue-800">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{score}%</span>
                    {/* Ring indicator */}
                    <div
                      className="absolute inset-[-4px] rounded-full border-4 border-primary-500 pointer-events-none transition-all duration-500"
                      style={{ clipPath: `polygon(50% 50%, -50% -50%, ${score >= 40 ? '150% -50%' : '50% -50%'}, ${score >= 70 ? '150% 150%' : score >= 40 ? '150% -50%' : '50% -50%'}, ${score >= 100 ? '-50% 150%' : '50% 50%'})` }}
                    ></div>
                  </div>
                  <p className="text-xs text-darkblue-350 font-medium">Placement readiness checklist</p>
                </div>

                {/* Checklist lists */}
                <div className="flex flex-col gap-3.5 mt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">Registered Account (40%)</p>
                      <p className="text-[10px] text-darkblue-400 mt-0.5">Creds verified and saved.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {checklist.hasDsa ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-darkblue-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs font-semibold ${checklist.hasDsa ? 'text-white' : 'text-darkblue-400'}`}>
                        Log DSA Progress (30%)
                      </p>
                      <p className="text-[10px] text-darkblue-400 mt-0.5">
                        Add at least one coding topic solve log.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {checklist.hasJob ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-darkblue-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs font-semibold ${checklist.hasJob ? 'text-white' : 'text-darkblue-400'}`}>
                        Log Job Applications (30%)
                      </p>
                      <p className="text-[10px] text-darkblue-400 mt-0.5">
                        Track at least one company application.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
