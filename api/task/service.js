const Task = require('../../model/TaskModel');
const { ObjectId } = require('mongodb');
const { startOfDay, endOfDay } = require('date-fns');

const {
    ResourceNotFound,
    BadRequest,
    Forbidden,
} = require('../../utils/httpErrors');
const {
    RESOURCE_NOT_FOUND,
    INVALID_REQUEST_PARAMETERS,
    INSUFFICIENT_PERMISSIONS,
} = require('../../utils/httpErrorCodes');
const { default: mongoose } = require('mongoose');

class Service {
    async createTask(payload, user_id) {
        const { title, category, content, status, due_date } = payload;
        const task = new Task({
            title,
            category,
            content,
            status,
            due_date,
            user_id,
        });
        const data = await task.save();
        return { data };
    }

    async getAllTodoTask(user_id, options = {}) {
        const objectIdUserId = new mongoose.Types.ObjectId(user_id);

        const categoryCt = await Task.aggregate([
            { $match: { user_id: objectIdUserId } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        const start = startOfDay(new Date());
        const end = endOfDay(new Date());

        const dueTodayCt = await Task.countDocuments({
            user_id,
            due_date: { $gte: start, $lte: end },
        });
      
       if (options.status) {
           query.status = options.status;
       }

        const tasks = await Task.paginate({ user_id: objectIdUserId }, options);
        return { categoryCt, dueTodayCt, tasks };
    }

    async getTodayTask(user_id, options = {}) {
        if (!ObjectId.isValid(user_id)) {
            throw new BadRequest(
                'Invalid user_id format.',
                INVALID_REQUEST_PARAMETERS
            );
        }

        const start = startOfDay(new Date());
        const end = endOfDay(new Date());

        const tasks = await Task.paginate(
            {
                user_id,
                due_date: { $gte: start, $lte: end },
            },
            options
        );

        return tasks;
    }

    async getTask(payload) {
        const { task_id, user_id } = payload;
        if (!ObjectId.isValid(task_id)) {
            throw new BadRequest(
                'Invalid Tasks_id format.',
                INVALID_REQUEST_PARAMETERS
            );
        }
        const task = await Task.findById(task_id);
        if (!task) {
            throw new ResourceNotFound(
                'Resource not found.',
                RESOURCE_NOT_FOUND
            );
        }
        if (task.user_id.toString() !== user_id.toString()) {
            throw new Forbidden(
                'You do not have permission to access this task.',
                INSUFFICIENT_PERMISSIONS
            );
        }
        return { task };
    }

    async getTasksByCat(payload, options = {}) {
        const { category, user_id } = payload;
        if (!ObjectId.isValid(user_id)) {
            throw new BadRequest(
                'Invalid user_id format.',
                INVALID_REQUEST_PARAMETERS
            );
        }

        const sanitizedCategory = category?.toLowerCase();

        const tasks = await Task.paginate(
            {
                user_id,
                category: sanitizedCategory,
                status: 'pending',
            },
            options
        );

        return tasks;
    }

    async editTask(payload) {
        const { task_id, user_id, status, category, content, due_date } =
            payload;
        if (!ObjectId.isValid(task_id)) {
            throw new BadRequest(
                'Invalid task_id format.',
                INVALID_REQUEST_PARAMETERS
            );
        }
        const task = await Task.findById(task_id);
        if (!task) {
            throw new ResourceNotFound(
                'Resource not found.',
                RESOURCE_NOT_FOUND
            );
        }
        if (task.user_id.toString() !== user_id.toString()) {
            throw new Forbidden(
                'You do not have permission to access this task.',
                INSUFFICIENT_PERMISSIONS
            );
        }
        const data = await Task.findByIdAndUpdate(
            task_id,
            {
                user_id,
                status: status || task.status,
                category: category || task.category,
                content: content || task.content,
                due_date: due_date || task.due_date,
            },
            {
                new: true,
            }
        );
        return { data };
    }

    async deleteTask(payload) {
        const { task_id, user_id } = payload;
        if (!ObjectId.isValid(task_id)) {
            throw new BadRequest(
                'Invalid user_id format.',
                INVALID_REQUEST_PARAMETERS
            );
        }
        const task = await Task.findOneAndDelete({
            _id: task_id,
            user_id,
        });
        if (!task)
            throw new ResourceNotFound(
                'Resource not found.',
                RESOURCE_NOT_FOUND
            );
    }

    async updateContent(payload) {
        const { task_id, user_id, content } = payload;

        if (!ObjectId.isValid(task_id)) {
            throw new BadRequest(
                'Invalid task_id format.',
                INVALID_REQUEST_PARAMETERS
            );
        }
        if (!content) {
            throw new BadRequest(
                'Invalid request params',
                INVALID_REQUEST_PARAMETERS
            );
        }
        const task = await Task.findById(task_id);

        if (!task) {
            throw new ResourceNotFound(
                'Resource not found.',
                RESOURCE_NOT_FOUND
            );
        }
        if (task.user_id.toString() !== user_id.toString()) {
            throw new Forbidden(
                'You do not have permission to access this task.',
                INSUFFICIENT_PERMISSIONS
            );
        }
        const updatedTaskField = await Task.findByIdAndUpdate(
            task_id,
            { content },

            {
                new: true,
            }
        );
        return { updatedTaskField };
    }

    async updateCat(payload) {
        const { task_id, user_id, category } = payload;
        if (!ObjectId.isValid(task_id)) {
            throw new BadRequest(
                'Invalid task_id format.',
                INVALID_REQUEST_PARAMETERS
            );
        }
        if (!category) {
            throw new BadRequest(
                'Invalid request params',
                INVALID_REQUEST_PARAMETERS
            );
        }
        const task = await Task.findById(task_id);
        if (!task) {
            throw new ResourceNotFound(
                'Resource not found.',
                RESOURCE_NOT_FOUND
            );
        }
        if (task.user_id.toString() !== user_id.toString()) {
            throw new Forbidden(
                'You do not have permission to access this task.',
                INSUFFICIENT_PERMISSIONS
            );
        }
        const updatedTaskField = await Task.findByIdAndUpdate(
            task_id,
            { category },
            {
                new: true,
            }
        );
        if (!updatedTaskField) {
            throw new ResourceNotFound('Task not found.', RESOURCE_NOT_FOUND);
        }
        return { updatedTaskField };
    }

    async updateStatus(payload) {
        const { task_id, user_id, status } = payload;
        if (!ObjectId.isValid(task_id)) {
            throw new BadRequest(
                'Invalid task_id format.',
                INVALID_REQUEST_PARAMETERS
            );
        }
        if (!status) {
            throw new BadRequest(
                'Invalid request params',
                INVALID_REQUEST_PARAMETERS
            );
        }
        const task = await Task.findById(task_id);
        if (!task) {
            throw new ResourceNotFound(
                'Resource not found.',
                RESOURCE_NOT_FOUND
            );
        }
        if (task.user_id.toString() !== user_id.toString()) {
            throw new Forbidden(
                'You do not have permission to access this task.',
                INSUFFICIENT_PERMISSIONS
            );
        }
        const updatedTaskField = await Task.findByIdAndUpdate(
            task_id,
            { status },
            {
                new: true,
            }
        );
        if (!updatedTaskField) {
            throw new ResourceNotFound('Task not found.', RESOURCE_NOT_FOUND);
        }
        return { updatedTaskField };
    }
}

module.exports = Service;
