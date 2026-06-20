import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Search, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/api/admin/students');
        if (res.data && res.data.success) {
          setStudents(res.data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load students roster');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          <p className="text-darkblue-400 font-medium">Retrieving student records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Student Directory</h2>
        <p className="text-sm text-darkblue-400 mt-1">
          Inspect, filter, and drill down into individual student placement preparation logs.
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative w-full sm:max-w-xs">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-darkblue-500 pointer-events-none">
          <Search className="h-4.5 w-4.5" />
        </span>
        <input
          type="text"
          className="form-input pl-10 py-2.5 text-sm"
          placeholder="Filter by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Students list */}
      {filteredStudents.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center flex flex-col items-center gap-3 text-darkblue-400">
          <AlertCircle className="h-8 w-8 text-darkblue-500 animate-pulse-subtle" />
          <p className="font-semibold text-white">No candidates match the criteria</p>
          <p className="text-xs text-darkblue-400">Verify your search term and try again.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-darkblue-850">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-darkblue-400 border-b border-darkblue-850 bg-darkblue-900/35 text-xs uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">Student Details</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkblue-850 text-darkblue-250">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-darkblue-900/20 group">
                    <td className="px-6 py-4 font-semibold text-darkblue-100 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary-950 border border-primary-850 text-primary-400 flex items-center justify-center font-bold text-xs">
                        {student.name[0].toUpperCase()}
                      </div>
                      <span className="truncate">{student.name}</span>
                    </td>
                    <td className="px-6 py-4 text-darkblue-300 font-medium truncate">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 text-darkblue-450 font-normal">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/students/${student._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary-450 hover:text-primary-350 transition-colors"
                      >
                        <span>View Progress</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
