const paginateResults = require('../../middlewares/pagination.middleware');
const Task = require('../../model/TaskModel');

const Service = require('./service');

this.service = new Service();
const createTodoTask = async (req, res) => {
    const user_id = req.user.id;
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

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const data = await this.service.getAllTodoTask(user_id, { page, limit });
    return res.ok({
        data,
    });
};

const getTodayTask = async (req, res) => {
    const user_id = req.user.id;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status;

    const data = await this.service.getTodayTask(user_id, {
        page,
        limit,
        status,
    });

    return res.ok({
        data,
    });
};

const getTaskBycat = async (req, res) => {
    const user_id = req.user.id;
    const category = req.query.category;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    payload = { category, user_id };

    const data = await this.service.getTasksByCat(payload, { page, limit });

    return res.ok({
        data,
    });
};

const editTodoTask = async (req, res) => {
    const payload = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        status: req.body.status,
        task_id: req.params.task_id,
        user_id: req.user.id,
    };

    const { data } = await this.service.editTask(payload);

    return res.ok({
        data,
    });
};

const deleteTodoTaskById = async (req, res) => {
    const payload = {
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
    createTodoTask,
    getTodayTask,
    getTodoTaskById,
    getAllTodoTask,
    getTaskBycat,
    editTodoTask,
    deleteTodoTaskById,
    //Less active routes
    updateTaskContentById,
    updateTaskCategoryById,
    updateTaskStatusById,
};
