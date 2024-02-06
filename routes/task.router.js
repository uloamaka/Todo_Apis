const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth.middleware");
const {
  createTodoTask,
  getTodoTaskById,
  getAllTodoTask,
  updateTaskContentById,
  updateTaskCategoryById,
  updateTaskStatusById,
  deleteTodoTaskById,
} = require("../api/task/controller");
const Task = require("../model/TaskModel")
const paginatedResults = require("../middlewares/pagination.middleware");

router.post("/create", userAuth, createTodoTask);

router.get("/:task_id", userAuth, getTodoTaskById);

router.get("/", userAuth, paginatedResults(Task), getAllTodoTask);

router.patch("/:task_id/edit_content", userAuth, updateTaskContentById);

router.patch("/:task_id/edit_category", userAuth, updateTaskCategoryById);

router.patch("/:task_id/edit_status", userAuth, updateTaskStatusById);

router.delete("/:task_id/delete", userAuth, deleteTodoTaskById);

module.exports = router;
