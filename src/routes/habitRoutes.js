import express from "express";
import mongoose from "mongoose";
import Habit from "../models/Habit.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log("🚨🚨🚨 DUMMY USER MIDDLEWARE IS WORKING 🚨🚨🚨");
  req.user = { id: "000000000000000000000001" };
  next();
});

router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const habit = await Habit.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid habit id" });
    }

    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid habit id" });
    }

    const deletedHabit = await Habit.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deletedHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/archive", async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOne({ _id: id, userId: req.user.id });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.archived = !habit.archived;
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/progress", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, delta } = req.body;

    const habit = await Habit.findOne({ _id: id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const dateKey = date || new Date().toISOString().slice(0, 10);
    const current = Number(habit.completions.get(dateKey) || 0);
    const next = Math.max(0, current + Number(delta || 0));

    habit.completions.set(dateKey, next);
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const habit = await Habit.findOne({ _id: id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const dateKey = date || new Date().toISOString().slice(0, 10);
    const current = Number(habit.completions.get(dateKey) || 0);
    const next = current >= habit.target ? 0 : habit.target;

    habit.completions.set(dateKey, next);
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
