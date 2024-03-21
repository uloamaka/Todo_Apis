const paginateResults = require("../../middlewares/pagination.middleware");
const Task = require("../../model/TaskModel");

const Service = require("./service");

this.service = new Service();
const createTodoTask = async (req, res) => {
  const user_id = req.user.id;
  console.log(req.body)
  let { data } = await this.service.createTask(req.body, user_id);

  return res.created({
    data,
  });
};

const getTodoTaskById = async (req, res) => {
  const payload = {
    task_id: req.params.task_id,
    user_id: req.user.id,
  };
  const task = await this.service.getTask(payload);

  return res.ok(task);
};

const getAllTodoTask = async (req, res) => {
  const user_id = req.user.id;
  const { page, status,limit } = req.query;
  const tasks = await Task.paginate({ status, user_id }, { limit: limit || 10, page });
  return res.ok(tasks);
};

const editTodoTask = async (req, res) => {
  const payload = {
    content: req.body.content,
    category: req.body.category,
    status: req.body.status,
    task_id: req.params.task_id,
    user_id: req.user.id,
  };
  console.log(req.params.task_id);

  const { data }  = await this.service.editTodo(payload);

  return res.ok({
    data
  });
};

const deleteTodoTaskById = async (req, res) => {
  const payload = {
    status: req.body.status,
    task_id: req.params.task_id,
    user_id: req.user.id,
  };

  await this.service.deleteTask(payload);

  res.noContent();
};


const updateTaskContentById = async (req, res) => {
  const payload = {
    content: req.body.content,
    task_id: req.params.task_id,
    user_id: req.user.id,
  };
  
  const data = await this.service.updateContent(payload);

  return res.ok(data.updatedTaskField);
};

const updateTaskCategoryById = async (req, res) => {
  const payload = {
    category: req.body.category,
    task_id: req.params.task_id,
    user_id: req.user.id,
  };

  const data = await this.service.updateCat(payload);

  return res.ok(data.updatedTaskField);
};

const updateTaskStatusById = async (req, res) => {
  const payload = {
    status: req.body.status,
    task_id: req.params.task_id,
    user_id: req.user.id,
  };

  const data = await this.service.updateStatus(payload);

  return res.ok(data.updatedTaskField);
};

module.exports = {
  //most active routes
  createTodoTask,
  getTodoTaskById,
  getAllTodoTask,
  editTodoTask,
  deleteTodoTaskById,
  //Less active routes
  updateTaskContentById,
  updateTaskCategoryById,
  updateTaskStatusById,
};
