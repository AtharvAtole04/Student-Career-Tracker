import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  ChevronDown,
  Loader2,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); // null for Add, job object for Edit
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    applicationDate: '',
    status: 'Applied',
    notes: '',
  });

  const fetchJobs = async () => {
    try {
      const res = await api.get('/api/jobs');
      setJobs(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load job applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openAddModal = () => {
    setSelectedJob(null);
    setFormData({
      companyName: '',
      role: '',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setFormData({
      companyName: job.companyName,
      role: job.role,
      applicationDate: new Date(job.applicationDate).toISOString().split('T')[0],
      status: job.status,
      notes: job.notes || '',
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.role.trim()) {
      toast.error('Company Name and Role are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        companyName: formData.companyName.trim(),
        role: formData.role.trim(),
        applicationDate: formData.applicationDate,
        status: formData.status,
        notes: formData.notes.trim(),
      };

      if (selectedJob) {
        // Edit mode
        const res = await api.put(`/api/jobs/${selectedJob._id}`, payload);
        toast.success('Job application updated!');
        setJobs(jobs.map((j) => (j._id === selectedJob._id ? res.data.data : j)));
      } else {
        // Add mode
        const res = await api.post('/api/jobs', payload);
        toast.success('Job application added!');
        setJobs([res.data.data, ...jobs]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to save application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) {
      return;
    }
    try {
      await api.delete(`/api/jobs/${id}`);
      toast.success('Application deleted successfully');
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete application');
    }
  };

  const handleStatusChangeDirect = async (jobId, newStatus) => {
    const job = jobs.find((j) => j._id === jobId);
    if (!job) return;

    try {
      const res = await api.put(`/api/jobs/${jobId}`, { ...job, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setJobs(jobs.map((j) => (j._id === jobId ? res.data.data : j)));
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Applied':
        return 'text-blue-400 bg-blue-950/40 border-blue-900/40';
      case 'OA Cleared':
        return 'text-purple-400 bg-purple-950/40 border-purple-900/40';
      case 'Interview Scheduled':
        return 'text-amber-400 bg-amber-950/40 border-amber-900/40';
      case 'Selected':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40';
      case 'Rejected':
        return 'text-rose-450 bg-rose-950/40 border-rose-900/40';
      default:
        return 'text-darkblue-400 bg-darkblue-900/40 border-darkblue-800';
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const searchString = `${job.companyName} ${job.role}`.toLowerCase();
    const matchesSearch = searchString.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalCount = jobs.length;
  const interviewCount = jobs.filter((j) => j.status === 'Interview Scheduled').length;
  const selectedCount = jobs.filter((j) => j.status === 'Selected').length;
  const rejectedCount = jobs.filter((j) => j.status === 'Rejected').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          <p className="text-darkblue-400 font-medium">Loading applications pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Job Applications</h2>
          <p className="text-sm text-darkblue-400 mt-1">
            Keep track of recruitment timelines, online assessment status, and interview pipelines.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary-600/10"
        >
          <Plus className="h-4 w-4" />
          <span>Track Application</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-darkblue-400 tracking-wider">Total Applications</p>
          <p className="text-2xl font-extrabold text-white mt-1">{totalCount}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Interviews</p>
          <p className="text-2xl font-extrabold text-white mt-1">{interviewCount}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Selected</p>
          <p className="text-2xl font-extrabold text-white mt-1">{selectedCount}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-rose-455 tracking-wider">Rejected</p>
          <p className="text-2xl font-extrabold text-white mt-1">{rejectedCount}</p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-darkblue-500 pointer-events-none">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            className="form-input pl-10 py-2 text-sm"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4.5 w-4.5 text-darkblue-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input py-2 text-sm bg-darkblue-900/60 w-full sm:w-48"
          >
            <option value="All">All Pipelines</option>
            <option value="Applied">Applied</option>
            <option value="OA Cleared">OA Cleared</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications list */}
      {filteredJobs.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center flex flex-col items-center gap-4 text-darkblue-400 mt-4">
          <AlertCircle className="h-10 w-10 text-darkblue-500 animate-pulse-subtle" />
          <div>
            <p className="font-semibold text-white">No active applications matching criteria</p>
            <p className="text-xs text-darkblue-400 mt-1">
              Add your first company target to begin pipeline calculations.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-darkblue-900 border border-darkblue-800 hover:border-darkblue-700 text-darkblue-250 hover:text-white rounded-xl text-xs font-semibold transition-all mt-2"
          >
            Log New Job Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden group"
            >
              <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-darkblue-100 group-hover:text-white text-base truncate">
                      {job.companyName}
                    </h3>
                    <p className="text-xs text-darkblue-400 truncate mt-0.5">{job.role}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold border rounded-full shrink-0 ${getStatusBadgeStyles(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Info block */}
                <div className="flex items-center gap-1.5 text-xs text-darkblue-400 mt-1">
                  <Calendar className="h-3.5 w-3.5 text-darkblue-500 shrink-0" />
                  <span>Applied: {new Date(job.applicationDate).toLocaleDateString()}</span>
                </div>

                {/* Notes block */}
                {job.notes && (
                  <div className="mt-2 text-xs text-darkblue-300 bg-darkblue-900/40 p-2.5 rounded-xl border border-darkblue-800/40 flex items-start gap-2">
                    <FileText className="h-3.5 w-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <p className="line-clamp-2 leading-relaxed">{job.notes}</p>
                  </div>
                )}
              </div>

              {/* Direct status update & actions footer */}
              <div className="flex items-center justify-between border-t border-darkblue-850 pt-3.5 mt-1">
                {/* Status Dropdown */}
                <div className="relative inline-block text-left">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChangeDirect(job._id, e.target.value)}
                    className="pl-2 pr-7 py-1 text-[11px] font-semibold bg-darkblue-900 border border-darkblue-800 rounded-lg text-darkblue-300 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="Applied">Applied</option>
                    <option value="OA Cleared">OA Cleared</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <ChevronDown className="h-3 w-3 text-darkblue-400 absolute right-2 top-2 pointer-events-none" />
                </div>

                {/* Edit / Delete */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(job)}
                    className="p-1.5 text-darkblue-450 hover:text-indigo-400 hover:bg-indigo-950/20 rounded-lg transition-all"
                    title="Edit application details"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-1.5 text-darkblue-455 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-all"
                    title="Delete log"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Slide-over Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-md h-full bg-darkblue-900/95 border-l border-darkblue-800 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform translate-x-0 z-10">
            <div>
              {/* Modal header */}
              <div className="flex justify-between items-center pb-4 border-b border-darkblue-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary-400" />
                  <span>{selectedJob ? 'Edit Application' : 'Track Application'}</span>
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-darkblue-400 hover:text-white rounded-lg focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} id="job-form" className="flex flex-col gap-4 mt-6">
                <div className="flex flex-col">
                  <label className="form-label" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Google, Microsoft, Stripe"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label" htmlFor="role">
                    Role / Position
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Software Engineer Intern, Associate PM"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="form-label" htmlFor="applicationDate">
                      Application Date
                    </label>
                    <input
                      id="applicationDate"
                      name="applicationDate"
                      type="date"
                      required
                      className="form-input text-sm"
                      value={formData.applicationDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label" htmlFor="status">
                      Status Stage
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="form-input bg-darkblue-900/60 text-sm"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Applied">Applied</option>
                      <option value="OA Cleared">OA Cleared</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="form-label" htmlFor="notes">
                    Notes / Remarks (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="5"
                    className="form-input resize-none"
                    placeholder="e.g. Interview scheduled for 3 rounds (Data structures, System Design, Fit). Ref: recruiter email..."
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </div>

            {/* Form footer */}
            <div className="flex items-center gap-3 justify-end pt-4 border-t border-darkblue-800">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 bg-darkblue-800 hover:bg-darkblue-750 text-darkblue-200 hover:text-white rounded-xl text-sm font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="job-form"
                disabled={submitting}
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-850 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-600/10 flex items-center gap-1.5 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{selectedJob ? 'Save Changes' : 'Add Application'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracker;
