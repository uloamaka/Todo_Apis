const Task = require("../model/TaskModel");
const { z } = require("zod");
const { ObjectId } = require("mongodb");
const {
  ResourceNotFound,
  BadRequest,
  Forbidden,
} = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
  INSUFFICIENT_PERMISSIONS,
} = require("../errors/httpErrorCodes");

const createTodoTask = async (req, res) => {
  const userId = req.user.id;
  const { category, content, status, due_date } = req.body;

  const task = new Task({
    category,
    content,
    status,
    due_date,
    user_id: userId,
  });
  const savedTask = await task.save();
  return res.created({
    message: savedTask,
    task_id: `${savedTask._id}`,
  });
};

const getTodoTaskById = async (req, res) => {
  const userId = req.user.id;
  const { task_id } = req.params;
  if (!ObjectId.isValid(task_id)) {
    throw new BadRequest(
      "Invalid Tasks_id format.",
      INVALID_REQUEST_PARAMETERS
    );
  }
  const task = await Task.findById(task_id);
  if (!task) {
    throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  }
  if (task.user_id.toString() !== userId.toString()) {
    throw new Forbidden(
      "You do not have permission to access this task.",
      INSUFFICIENT_PERMISSIONS
    );
  }

  return res.ok(task);
};

const getAllTodoTask = async (req, res) => {
  const userId = req.user.id;
  const tasks = await Task.find({ user_id: userId });

  if (!tasks || tasks.length === 0) {
    throw new ResourceNotFound(
      "No tasks found for the user.",
      RESOURCE_NOT_FOUND
    );
  }

  return res.ok(tasks);
};

const updateTaskContentById = async (req, res) => {
  const userId = req.user.id;
  const { task_id } = req.params;
  const { content } = req.body;
  if (!ObjectId.isValid(task_id)) {
    throw new BadRequest("Invalid task_id format.", INVALID_REQUEST_PARAMETERS);
  }
  if (!content) {
    throw new BadRequest("Invalid request params", INVALID_REQUEST_PARAMETERS);
  }
  const task = await Task.findById(task_id);
  if (!task) {
    throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  }
  if (task.user_id.toString() !== userId.toString()) {
    throw new Forbidden(
      "You do not have permission to access this task.",
      INSUFFICIENT_PERMISSIONS
    );
  }
  const updatedTaskField = await Task.findByIdAndUpdate(
    task_id,
    { content, updatedAt: Date.now() },

    {
      new: true,
    }
  );
  if (!updatedTaskField) {
    throw new ResourceNotFound("Task not found.", RESOURCE_NOT_FOUND);
  }

  return res.ok(updatedTaskField);
};

const updateTaskCategoryById = async (req, res) => {
  const userId = req.user.id;
  const { task_id } = req.params;
  const { category } = req.body;
  if (!ObjectId.isValid(task_id)) {
    throw new BadRequest("Invalid task_id format.", INVALID_REQUEST_PARAMETERS);
  }
  if (!category) {
    throw new BadRequest("Invalid request params", INVALID_REQUEST_PARAMETERS);
  }
  const task = await Task.findById(task_id);
  if (!task) {
    throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  }
  if (task.user_id.toString() !== userId.toString()) {
    throw new Forbidden(
      "You do not have permission to access this task.",
      INSUFFICIENT_PERMISSIONS
    );
  }
  const updatedTaskField = await Task.findByIdAndUpdate(
    task_id,
    { category, updatedAt: Date.now() },
    {
      new: true,
    }
  );
  if (!updatedTaskField) {
    throw new ResourceNotFound("Task not found.", RESOURCE_NOT_FOUND);
  }

  return res.ok(updatedTaskField);
};

const updateTaskStatusById = async (req, res) => {
  const userId = req.user.id;
  const { task_id } = req.params;
  const { status } = req.body;
  if (!ObjectId.isValid(task_id)) {
    throw new BadRequest("Invalid task_id format.", INVALID_REQUEST_PARAMETERS);
  }
  if (!status) {
    throw new BadRequest("Invalid request params", INVALID_REQUEST_PARAMETERS);
  }
  const task = await Task.findById(task_id);
  if (!task) {
    throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  }
  if (task.user_id.toString() !== userId.toString()) {
    throw new Forbidden(
      "You do not have permission to access this task.",
      INSUFFICIENT_PERMISSIONS
    );
  }
  const updatedTaskField = await Task.findByIdAndUpdate(
    task_id,
    { status, updatedAt: Date.now() },

    {
      new: true,
    }
  );
  if (!updatedTaskField) {
    throw new ResourceNotFound("Task not found.", RESOURCE_NOT_FOUND);
  }

  return res.ok(updatedTaskField);
};

const deleteTodoTaskById = async (req, res) => {
  const userId = req.user.id;
  const { task_id } = req.params;
  if (!ObjectId.isValid(task_id)) {
    throw new BadRequest("Invalid user_id format.", INVALID_REQUEST_PARAMETERS);
  }
  const task = await Task.findOneAndDelete({ _id: task_id, user_id: userId });
  if (!task)
    throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  res.noContent();
};

module.exports = {
  createTodoTask,
  getTodoTaskById,
  getAllTodoTask,
  updateTaskContentById,
  updateTaskCategoryById,
  updateTaskStatusById,
  deleteTodoTaskById,
};
