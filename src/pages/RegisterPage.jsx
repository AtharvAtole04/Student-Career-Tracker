import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, User, Mail, Lock, Shield, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = formData;

    // Basic Validation
    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await register(name, email, password, role);
      toast.success(`Account registered! Welcome, ${data.name}.`);
      
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-darkblue-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-glow-purple pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-glow-indigo pointer-events-none z-0" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md glass-panel p-8 rounded-2xl shadow-xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Link to="/" className="flex items-center gap-2.5">
            <GraduationCap className="h-9 w-9 text-primary-500" />
            <span className="font-bold text-xl tracking-wider bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
              CareerTracker
            </span>
          </Link>
          <h2 className="text-lg font-bold text-white mt-3">Create an Account</h2>
          <p className="text-xs text-darkblue-400">Join Student Career Tracker to build your dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col">
            <label className="form-label text-xs" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-darkblue-500 pointer-events-none">
                <User className="h-4 w-4" />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input pl-10 py-2 text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="form-label text-xs" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-darkblue-500 pointer-events-none">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input pl-10 py-2 text-sm"
                placeholder="john@university.edu"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="form-label text-xs" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-darkblue-500 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pl-9 py-2 text-sm"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="form-label text-xs" htmlFor="confirmPassword">
                Confirm
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-darkblue-500 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input pl-9 py-2 text-sm"
                  placeholder="••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="form-label text-xs" htmlFor="role">
              Account Role
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-darkblue-500 pointer-events-none">
                <Shield className="h-4 w-4" />
              </span>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input pl-10 py-2 text-sm appearance-none bg-darkblue-900/60"
              >
                <option value="student">Student (Track prep progress)</option>
                <option value="admin">Admin (Oversee student registries)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 disabled:from-primary-850 disabled:to-indigo-850 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-darkblue-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-350 font-semibold transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
