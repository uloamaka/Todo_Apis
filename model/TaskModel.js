const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["personal", "shopping", "wishlist", "work", "default"],
    default: "default",
  },
  content: {
    type: String,
    minlength: [2, "Content must be at least 2 characters long."],
    maxlength: [100, "Content cannot exceed 100 characters."],
  },
  status: {
    type: String,
    enum: ["completed", "pending"],
    default: "pending",
  },
  due_date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
taskSchema.index({ category: 1, status: 1 });
taskSchema.methods.markAsCompleted = function () {
  this.status = "completed";
  return this.save();
};

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
