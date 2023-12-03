const Task = require("../model/TaskModel");
const { z } = require("zod");
const { ObjectId } = require("mongodb");
const { ResourceNotFound, BadRequest } = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
} = require("../errors/httpErrorCodes");

const createTodoTask = async (req, res) => {
  const { category, content, status, due_date } = req.body;

  const task = new Task({ category, content, status, due_date });
  const savedTask = await task.save();
  return res.created({
    message: savedTask,
    task_id: `${savedTask._id}`,
  });
};

const getTodoTaskById = async (req, res) => {
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
  return res.ok(task);
};

const getAllTodoTask = async (req, res) => {
  const task = await Task.find();
  if (!task) {
    throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  }
  return res.ok(task);
};

const updateTaskContentById = async (req, res) => {
  const { task_id } = req.params;
  const { content } = req.body;
  if (!ObjectId.isValid(task_id)) {
    throw new BadRequest("Invalid task_id format.", INVALID_REQUEST_PARAMETERS);
  }
  if (!content) {
    throw new BadRequest("Invalid request params", INVALID_REQUEST_PARAMETERS);
  }
  const updatedTaskField = await Task.findByIdAndUpdate(
    { _id: task_id },
    { content, updatedAt: Date.now() },

    {
      new: true,
    }
  );
  if (!updatedTaskField) {
    throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  }

  return res.ok(updatedTaskField);
};

const updateTaskCategoryById = async (req, res) => {
  const { task_id } = req.params;
  const { category } = req.body;
  if (!ObjectId.isValid(task_id)) {
    throw new BadRequest("Invalid task_id format.", INVALID_REQUEST_PARAMETERS);
  }
  if (!category) {
    throw new BadRequest("Invalid request params", INVALID_REQUEST_PARAMETERS);
  }
  const updatedTaskField = await Task.findByIdAndUpdate(
    { _id: task_id },
    { category, updatedAt: Date.now() },
    {
      new: true,
    }
  );
  if (!updatedTaskField) {
    throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  }

  return res.ok(updatedTaskField);
};

const updateTaskStatusById = async (req, res) => {
  const { task_id } = req.params;
  const { status } = req.body;
  if (!ObjectId.isValid(task_id)) {
    throw new BadRequest("Invalid task_id format.", INVALID_REQUEST_PARAMETERS);
  }
  if (!status) {
    throw new BadRequest("Invalid request params", INVALID_REQUEST_PARAMETERS);
  }
  const updatedTaskField = await Task.findByIdAndUpdate(
    { _id: task_id },
    { status, updatedAt: Date.now() },

    {
      new: true,
    }
  );
  if (!updatedTaskField) {
    throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  }

  return res.ok(updatedTaskField);
};

const deleteTodoTaskById = async (req, res) => {
  const { task_id } = req.params;
  if (!ObjectId.isValid(task_id)) {
    throw new BadRequest("Invalid user_id format.", INVALID_REQUEST_PARAMETERS);
  }
  const task = await Task.findOneAndDelete(task_id);
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
