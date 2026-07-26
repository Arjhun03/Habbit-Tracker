import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import HabitModal from '../components/HabitModal';
import { Plus, CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/habits');
      setHabits(res.data);
    } catch (err) {
      console.error('Fetch habits error:', err);
      setError(err.response?.data?.message || 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleOpenAddModal = () => {
    setHabitToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (habit) => {
    setHabitToEdit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (habitData) => {
    if (habitToEdit) {
      // Update habit
      const res = await API.put(`/habits/${habitToEdit._id}`, habitData);
      setHabits(habits.map((h) => (h._id === habitToEdit._id ? res.data : h)));
    } else {
      // Create habit
      const res = await API.post('/habits', habitData);
      setHabits([res.data, ...habits]);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    try {
      await API.delete(`/habits/${habitId}`);
      setHabits(habits.filter((h) => h._id !== habitId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete habit');
    }
  };

  const handleToggleComplete = async (habitId) => {
    try {
      const res = await API.patch(`/habits/${habitId}/complete`);
      setHabits(habits.map((h) => (h._id === habitId ? res.data : h)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update habit status');
    }
  };

  const completedCount = habits.filter((h) => h.completedToday).length;
  const pendingCount = habits.length - completedCount;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {user?.name || 'User'} 👋
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Track your daily routines and build momentum
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start md:self-auto text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Today's Habits
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {habits.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Completed Today
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {completedCount}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Today
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Habit List Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Your Habits
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : habits.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-10 text-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ListTodo className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                No habits added yet
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Start tracking your daily goals by adding your very first habit.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="mt-4 inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Habit</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Habit Create / Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveHabit}
        habitToEdit={habitToEdit}
      />
    </div>
  );
};

export default DashboardPage;
