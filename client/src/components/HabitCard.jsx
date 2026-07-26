import { Flame, Edit2, Trash2, Check } from 'lucide-react';

const HabitCard = ({ habit, onToggleComplete, onEdit, onDelete }) => {
  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-all shadow-xs hover:shadow-md ${
        habit.completedToday
          ? 'border-emerald-200 bg-emerald-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Checkbox and Habit Details */}
        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => onToggleComplete(habit._id)}
            className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
              habit.completedToday
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 bg-white hover:border-emerald-500 text-transparent'
            }`}
            aria-label={habit.completedToday ? 'Mark incomplete' : 'Mark complete'}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base truncate ${
                habit.completedToday
                  ? 'line-through text-slate-500'
                  : 'text-slate-900'
              }`}
            >
              {habit.title}
            </h3>

            {habit.description && (
              <p
                className={`text-sm mt-1 line-clamp-2 ${
                  habit.completedToday ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {habit.description}
              </p>
            )}

            {/* Streak Badge */}
            <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{habit.currentStreak} {habit.currentStreak === 1 ? 'Day' : 'Days'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => onEdit(habit)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Habit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(habit._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
