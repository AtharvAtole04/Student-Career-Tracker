import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, Code2, Loader2 } from 'lucide-react';

const AddDsaProgress = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    topicName: '',
    totalQuestions: '',
    solvedQuestions: '',
    difficulty: 'Easy',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (editId) {
      const fetchRecord = async () => {
        setFetching(true);
        try {
          const res = await api.get('/api/dsa');
          const record = res.data.data.find((rec) => rec._id === editId);
          if (record) {
            setFormData({
              topicName: record.topicName,
              totalQuestions: record.totalQuestions,
              solvedQuestions: record.solvedQuestions,
              difficulty: record.difficulty,
              notes: record.notes || '',
            });
          } else {
            toast.error('Record not found');
            navigate('/dsa');
          }
        } catch (error) {
          console.error(error);
          toast.error('Error fetching record details');
          navigate('/dsa');
        } finally {
          setFetching(false);
        }
      };
      fetchRecord();
    }
  }, [editId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { topicName, totalQuestions, solvedQuestions, difficulty, notes } = formData;

    const total = parseInt(totalQuestions, 10);
    const solved = parseInt(solvedQuestions, 10);

    // Form Validations
    if (!topicName.trim()) {
      toast.error('Topic name is required');
      return;
    }

    if (isNaN(total) || total <= 0) {
      toast.error('Total questions must be a positive number');
      return;
    }

    if (isNaN(solved) || solved < 0) {
      toast.error('Solved questions cannot be negative');
      return;
    }

    if (solved > total) {
      toast.error('Solved questions cannot exceed total questions');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        topicName: topicName.trim(),
        totalQuestions: total,
        solvedQuestions: solved,
        difficulty,
        notes: notes.trim(),
      };

      if (editId) {
        await api.put(`/api/dsa/${editId}`, payload);
        toast.success('DSA progress updated!');
      } else {
        await api.post('/api/dsa', payload);
        toast.success('DSA progress logged!');
      }
      navigate('/dsa');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to save progress');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          <p className="text-darkblue-400 font-medium">Fetching details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <Link
          to="/dsa"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-darkblue-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 duration-200" />
          <span>Back to Tracker</span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {editId ? 'Edit DSA Progress' : 'Log DSA Progress'}
        </h2>
        <p className="text-sm text-darkblue-400 mt-1">
          {editId ? 'Update your current topic stats and notes.' : 'Log details for a new topic you have prepared.'}
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="form-label" htmlFor="topicName">
              Topic Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-darkblue-500 pointer-events-none">
                <Code2 className="h-4.5 w-4.5" />
              </span>
              <input
                id="topicName"
                name="topicName"
                type="text"
                required
                className="form-input pl-10"
                placeholder="e.g. Arrays, Dynamic Programming, Graphs"
                value={formData.topicName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="form-label" htmlFor="totalQuestions">
                Total Questions
              </label>
              <input
                id="totalQuestions"
                name="totalQuestions"
                type="number"
                required
                min="1"
                className="form-input"
                placeholder="e.g. 50"
                value={formData.totalQuestions}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="form-label" htmlFor="solvedQuestions">
                Solved Questions
              </label>
              <input
                id="solvedQuestions"
                name="solvedQuestions"
                type="number"
                required
                min="0"
                className="form-input"
                placeholder="e.g. 25"
                value={formData.solvedQuestions}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="form-label" htmlFor="difficulty">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                className="form-input bg-darkblue-900/60"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="form-label" htmlFor="notes">
              Key Insights / Revision Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              className="form-input resize-none"
              placeholder="e.g. Focus on sliding window approach, optimized space complexity from O(N) to O(1)..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-darkblue-850 mt-2">
            <Link
              to="/dsa"
              className="px-5 py-2.5 bg-darkblue-900/40 border border-darkblue-800 hover:border-darkblue-700 text-darkblue-250 hover:text-white rounded-xl text-sm font-semibold transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-600/10 flex items-center gap-1.5 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>{editId ? 'Update Progress' : 'Log Progress'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDsaProgress;
