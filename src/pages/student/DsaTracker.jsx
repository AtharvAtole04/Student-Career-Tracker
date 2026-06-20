import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Code2,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  BookOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';

const DsaTracker = () => {
  const [dsaRecords, setDsaRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const fetchRecords = async () => {
    try {
      const res = await api.get('/api/dsa');
      setDsaRecords(res.data.data);
    } catch (error) {
      console.error('Failed to load DSA records:', error.message);
      toast.error('Failed to retrieve DSA records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this DSA progress record?')) {
      return;
    }

    try {
      await api.delete(`/api/dsa/${id}`);
      toast.success('Record deleted successfully');
      setDsaRecords(dsaRecords.filter((rec) => rec._id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to delete record');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40';
      case 'Medium':
        return 'text-amber-400 bg-amber-950/40 border-amber-900/40';
      case 'Hard':
        return 'text-rose-450 bg-rose-950/40 border-rose-900/40';
      default:
        return 'text-darkblue-400 bg-darkblue-900/40 border-darkblue-800';
    }
  };

  const filteredRecords = dsaRecords.filter((rec) => {
    const matchesSearch = rec.topicName.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || rec.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          <p className="text-darkblue-400 font-medium">Loading DSA logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">DSA Tracker</h2>
          <p className="text-sm text-darkblue-400 mt-1">
            Monitor topic-wise problem-solving metrics across different difficulties.
          </p>
        </div>
        <Link
          to="/dsa/add"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary-600/10"
        >
          <Plus className="h-4 w-4" />
          <span>Add Progress</span>
        </Link>
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
            placeholder="Search topic name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4.5 w-4.5 text-darkblue-400 shrink-0" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="form-input py-2 text-sm bg-darkblue-900/60 w-full sm:w-44"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* List / Cards */}
      {filteredRecords.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center flex flex-col items-center gap-4 text-darkblue-400 mt-4">
          <AlertCircle className="h-10 w-10 text-darkblue-500 animate-pulse-subtle" />
          <div>
            <p className="font-semibold text-white">No DSA progress records found</p>
            <p className="text-xs text-darkblue-400 mt-1">
              Try adjusting your search criteria or add a new record to get started.
            </p>
          </div>
          <Link
            to="/dsa/add"
            className="px-4 py-2 bg-darkblue-900 border border-darkblue-800 hover:border-darkblue-700 text-darkblue-250 hover:text-white rounded-xl text-xs font-semibold transition-all mt-2"
          >
            Log New Progress
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((rec) => {
            const pct = Math.round((rec.solvedQuestions / rec.totalQuestions) * 100) || 0;
            return (
              <div key={rec._id} className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden group">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-darkblue-100 group-hover:text-white text-base truncate">{rec.topicName}</h3>
                    <span className={`px-2 py-0.5 text-[9px] font-bold border rounded-full shrink-0 ${getDifficultyColor(rec.difficulty)}`}>
                      {rec.difficulty}
                    </span>
                  </div>

                  {/* Solved Progress Bar */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-darkblue-400 font-medium">Solved</span>
                      <span className="font-bold text-darkblue-200">
                        {rec.solvedQuestions} <span className="text-darkblue-500">/ {rec.totalQuestions}</span> ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-darkblue-900 rounded-full h-2 overflow-hidden border border-darkblue-850">
                      <div
                        className="bg-primary-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Notes snippet */}
                  {rec.notes && (
                    <div className="mt-2 text-xs text-darkblue-300 bg-darkblue-900/40 p-2.5 rounded-xl border border-darkblue-800/40 flex items-start gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-primary-400 mt-0.5 shrink-0" />
                      <p className="line-clamp-2 leading-relaxed">{rec.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions bottom row */}
                <div className="flex items-center justify-between border-t border-darkblue-850 pt-3.5 mt-1 text-xs">
                  <span className="text-[10px] text-darkblue-500">
                    Logged {new Date(rec.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/dsa/add?edit=${rec._id}`}
                      className="p-2 text-darkblue-450 hover:text-primary-400 hover:bg-primary-950/20 rounded-lg transition-all"
                      title="Edit progress"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(rec._id)}
                      className="p-2 text-darkblue-455 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-all"
                      title="Delete log"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DsaTracker;
