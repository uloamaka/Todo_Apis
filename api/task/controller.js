const Service = require("./service");

this.service = new Service();
const createTodoTask = async (req, res) => {
  const user_id = req.user.id;

  const { savedTask } = this.service.createTask(req.body, user_id);
  return res.created({
    message: savedTask,
    task_id: `${savedTask._id}`,
  });
};

const getTodoTaskById = async (req, res) => {
  const payload = {
    task_id: req.params.task_id,
    user_id: req.user.id,
  };
  const task = await this.service.getTask(payload);

  return res.ok({ message: task });
};

const getAllTodoTask = async (req, res) => {
  paginateResults(Task)(req, res, async () => {
    const tasks = res.paginatedResults;
    if (!tasks || tasks.length === 0) {
      throw new ResourceNotFound(
        "No tasks found for the user.",
        RESOURCE_NOT_FOUND
      );
    }
    return res.ok(tasks);
  });
};

const updateTaskContentById = async (req, res) => {
  const payload = {
    content: req.body.content,
    task_id: req.params.task_id,
    user_id: req.user.id,
  };

  const updatedTaskField = await this.service.updateContent(payload);

  return res.ok(updatedTaskField);
};

const updateTaskCategoryById = async (req, res) => {
  const payload = {
    category: req.body.category,
    task_id: req.params.task_id,
    user_id: req.user.id,
  };

  const updatedTaskField = await this.service.updateCat(payload);

  return res.ok(updatedTaskField);
};

const updateTaskStatusById = async (req, res) => {
  const payload = {
    status: req.body.status,
    task_id: req.params.task_id,
    user_id: req.user.id,
  };

  const updatedTaskField = await this.service.updateStatus(payload);

  return res.ok(updatedTaskField);
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

module.exports = {
  createTodoTask,
  getTodoTaskById,
  getAllTodoTask,
  updateTaskContentById,
  updateTaskCategoryById,
  updateTaskStatusById,
  deleteTodoTaskById,
};
