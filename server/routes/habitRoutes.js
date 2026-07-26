import express from 'express';
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
} from '../controllers/habitController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all habit routes

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .put(updateHabit)
  .delete(deleteHabit);

router.patch('/:id/complete', completeHabit);

export default router;
