import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Validation
    if (!email || !password) {
      toast.error('Please enter all credentials');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.name}!`);
      
      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-darkblue-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-glow-purple pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-glow-indigo pointer-events-none z-0" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md glass-panel p-8 rounded-2xl shadow-xl flex flex-col gap-6">
        {/* Logo and title */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex items-center gap-2.5">
            <GraduationCap className="h-10 w-10 text-primary-500" />
            <span className="font-bold text-2xl tracking-wider bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
              CareerTracker
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white mt-4">Welcome Back</h2>
          <p className="text-xs text-darkblue-400">Sign in to update your placement metrics</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-darkblue-500 pointer-events-none">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input pl-11"
                placeholder="you@university.edu"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-darkblue-500 pointer-events-none">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-input pl-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 disabled:from-primary-850 disabled:to-indigo-850 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs text-darkblue-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-350 font-semibold transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
