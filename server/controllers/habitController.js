import { supabase } from '../config/supabase.js';
import { getFormattedDate, getYesterdayFormattedDate } from '../utils/dateUtils.js';

const formatHabit = (habit, completedToday = false) => ({
  _id: habit.id,
  userId: habit.user_id,
  title: habit.title,
  description: habit.description || '',
  currentStreak: habit.current_streak || 0,
  completedToday,
  createdAt: habit.created_at,
});

const getHabitForUser = async (habitId, userId) => {
  const { data, error } = await supabase
    .from('habits')
    .select('id, user_id, title, description, current_streak, created_at')
    .eq('id', habitId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

const getCompletedLog = async (habitId, date) => {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('id')
    .eq('habit_id', habitId)
    .eq('date', date)
    .eq('completed', true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

// @desc    Get all habits for logged in user
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res) => {
  try {
    const todayStr = getFormattedDate();
    const yesterdayStr = getYesterdayFormattedDate();

    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id, user_id, title, description, current_streak, created_at')
      .eq('user_id', req.user._id)
      .order('created_at', { ascending: false });

    if (habitsError) {
      throw habitsError;
    }

    // Enhance habits with completion status and verified current streak
    const formattedHabits = await Promise.all(
      habits.map(async (habit) => {
        // Check if completed today
        const todayLog = await getCompletedLog(habit.id, todayStr);

        // Check if completed yesterday
        const yesterdayLog = await getCompletedLog(habit.id, yesterdayStr);

        const completedToday = Boolean(todayLog);
        const completedYesterday = Boolean(yesterdayLog);

        // If not completed today AND not completed yesterday, active streak is reset to 0
        let effectiveStreak = habit.current_streak;
        if (!completedToday && !completedYesterday && habit.current_streak > 0) {
          effectiveStreak = 0;
          const { error: resetError } = await supabase
            .from('habits')
            .update({ current_streak: 0 })
            .eq('id', habit.id)
            .eq('user_id', req.user._id);

          if (resetError) {
            throw resetError;
          }
        }

        return formatHabit({ ...habit, current_streak: effectiveStreak }, completedToday);
      })
    );

    return res.json(formattedHabits);
  } catch (error) {
    console.error('Get Habits Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Habit title is required' });
    }

    const { data: habit, error: createError } = await supabase
      .from('habits')
      .insert({
      user_id: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      current_streak: 0,
      })
      .select('id, user_id, title, description, current_streak, created_at')
      .single();

    if (createError) {
      throw createError;
    }

    return res.status(201).json(formatHabit(habit, false));
  } catch (error) {
    console.error('Create Habit Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existingHabit = await getHabitForUser(req.params.id, req.user._id);

    if (!existingHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const updates = {};
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Habit title cannot be empty' });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    const { data: habit, error: updateError } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user._id)
      .select('id, user_id, title, description, current_streak, created_at')
      .single();

    if (updateError) {
      throw updateError;
    }

    const todayStr = getFormattedDate();
    const todayLog = await getCompletedLog(habit.id, todayStr);

    return res.json(formatHabit(habit, Boolean(todayLog)));
  } catch (error) {
    console.error('Update Habit Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res) => {
  try {
    const habit = await getHabitForUser(req.params.id, req.user._id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Delete habit and associated logs
    const { error: logsError } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habit.id);

    if (logsError) {
      throw logsError;
    }

    const { error: habitError } = await supabase
      .from('habits')
      .delete()
      .eq('id', habit.id)
      .eq('user_id', req.user._id);

    if (habitError) {
      throw habitError;
    }

    return res.json({ message: 'Habit removed successfully' });
  } catch (error) {
    console.error('Delete Habit Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Toggle/Mark habit completion for today
// @route   PATCH /api/habits/:id/complete
// @access  Private
export const completeHabit = async (req, res) => {
  try {
    const habit = await getHabitForUser(req.params.id, req.user._id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const todayStr = getFormattedDate();
    const yesterdayStr = getYesterdayFormattedDate();

    // Check if log already exists for today
    const { data: existingLog, error: existingLogError } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habit.id)
      .eq('date', todayStr)
      .maybeSingle();

    if (existingLogError) {
      throw existingLogError;
    }

    let completedToday = false;
    let currentStreak = habit.current_streak || 0;

    if (existingLog) {
      // Toggle off / Uncomplete
      const { error: deleteLogError } = await supabase
        .from('habit_logs')
        .delete()
        .eq('id', existingLog.id);

      if (deleteLogError) {
        throw deleteLogError;
      }
      
      // Recalculate streak without today's completion
      const yesterdayLog = await getCompletedLog(habit.id, yesterdayStr);

      if (yesterdayLog) {
        currentStreak = Math.max(0, currentStreak - 1);
      } else {
        currentStreak = 0;
      }
      completedToday = false;
    } else {
      // Mark as completed for today
      const { error: createLogError } = await supabase
        .from('habit_logs')
        .insert({
        habit_id: habit.id,
        date: todayStr,
        completed: true,
        });

      if (createLogError) {
        throw createLogError;
      }

      // Check if yesterday was completed
      const yesterdayLog = await getCompletedLog(habit.id, yesterdayStr);

      if (yesterdayLog) {
        // Continuation of streak
        currentStreak += 1;
      } else {
        // New streak starting today
        currentStreak = 1;
      }
      completedToday = true;
    }

    const { data: updatedHabit, error: updateError } = await supabase
      .from('habits')
      .update({ current_streak: currentStreak })
      .eq('id', habit.id)
      .eq('user_id', req.user._id)
      .select('id, user_id, title, description, current_streak, created_at')
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.json(formatHabit(updatedHabit, completedToday));
  } catch (error) {
    console.error('Complete Habit Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};
