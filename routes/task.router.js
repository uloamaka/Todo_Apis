const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth.middleware");
const Ctrl = require("../api/task/controller");
const Task = require("../model/TaskModel")
const paginatedResults = require("../middlewares/pagination.middleware");

router.post("/create", userAuth, Ctrl.createTodoTask);

router.get("/:task_id", userAuth, Ctrl.getTodoTaskById);

router.get("/", userAuth, paginatedResults(Task), Ctrl.getAllTodoTask);

router.patch("/:task_id/edit_content", userAuth, Ctrl.updateTaskContentById);

router.patch("/:task_id/edit_category", userAuth, Ctrl.updateTaskCategoryById);

router.patch("/:task_id/edit_status", userAuth, Ctrl.updateTaskStatusById);

router.delete("/:task_id/delete", userAuth, Ctrl.deleteTodoTaskById);

module.exports = router;
