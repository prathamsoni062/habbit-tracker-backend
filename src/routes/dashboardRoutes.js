import express from "express";
import Habit from "../models/Habit.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
// router.use(authMiddleware);

router.use((req, res, next) => {
  req.user = { id: "000000000000000000000001" };
  next();
});

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getIsScheduledToday(habit, date = new Date()) {
  const day = date.getDay();
  if (habit.frequency === "Daily") return true;
  if (habit.frequency === "Weekdays") return day >= 1 && day <= 5;
  if (habit.frequency === "Weekends") return day === 0 || day === 6;
  if (habit.frequency === "Custom") return habit.customDays.includes(day);
  return false;
}

router.get("/summary", async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id, archived: false });
    const key = todayKey();

    const total = habits.length;
    const dueToday = habits.filter((h) => getIsScheduledToday(h)).length;
    const completedToday = habits.filter((h) => Number(h.completions?.get(key) || 0) >= Number(h.target || 1)).length;
    const completionRate = dueToday ? Math.round((completedToday / dueToday) * 100) : 0;

    res.json({
      total,
      dueToday,
      completedToday,
      completionRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
