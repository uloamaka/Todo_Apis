const express = require("express");
const router = express.Router();

const {
  createTodoTask,
  getTodoTaskById,
  getAllTodoTask,
  updateTaskContentById,
  updateTaskCategoryById,
  updateTaskStatusById,
  deleteTodoTaskById,
} = require("../controllers/task.controller");

router.post("/create", createTodoTask);
router.get("/:task_id", getTodoTaskById);
router.get("/", getAllTodoTask);
router.patch(
  "/:task_id/edit_content",
  updateTaskContentById,
);router.patch(
  "/:task_id/edit_category",
  updateTaskCategoryById,
);router.patch(
  "/:task_id/edit_status",
  updateTaskStatusById
);
router.delete("/:task_id/delete", deleteTodoTaskById);

module.exports = router;
