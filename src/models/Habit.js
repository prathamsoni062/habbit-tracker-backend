import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Personal",
    },
    frequency: {
      type: String,
      enum: ["Daily", "Weekdays", "Weekends", "Custom"],
      default: "Daily",
    },
    customDays: {
      type: [Number],
      default: [],
    },
    target: {
      type: Number,
      default: 1,
      min: 1,
    },
    unit: {
      type: String,
      default: "times",
    },
    preferredTime: {
      type: String,
      default: "08:00",
    },
    color: {
      type: String,
      default: "from-indigo-500 to-purple-500",
    },
    notes: {
      type: String,
      default: "",
    },
    archived: {
      type: Boolean,
      default: false,
    },
    completions: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;
