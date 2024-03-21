const Task = require("../../model/TaskModel");
const { ObjectId } = require("mongodb");

const {
  ResourceNotFound,
  BadRequest,
  Forbidden,
} = require("../../utils/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
  INSUFFICIENT_PERMISSIONS,
} = require("../../utils/httpErrorCodes");

class Service {
  async createTask(payload, user_id) {
    const { category, content, status, due_date } = payload;
    const task = new Task({
      category,
      content,
      status,
      due_date,
      user_id,
    });
    const data = await task.save();
    return { data };
  }

  async getTask(payload) {
    const { task_id, user_id } = payload;
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
    if (task.user_id.toString() !== user_id.toString()) {
      throw new Forbidden(
        "You do not have permission to access this task.",
        INSUFFICIENT_PERMISSIONS
        );
      }
      return { task };
    }
    
  async editTodo(payload) {
      const {
        task_id,
        user_id,
        status,
        category,
        content,
        due_date,
      } = payload;
      if (!ObjectId.isValid(task_id)) {
        throw new BadRequest(
          "Invalid task_id format.",
          INVALID_REQUEST_PARAMETERS
        );
      }
      const task = await Task.findById( task_id );
      if (!task) {
        throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
      }
      if (task.user_id.toString() !== user_id.toString()) {
        throw new Forbidden(
          "You do not have permission to access this task.",
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
          "Invalid user_id format.",
          INVALID_REQUEST_PARAMETERS
        );
      }
      const task = await Task.findOneAndDelete({
        _id: task_id,
        user_id,
      });
      if (!task)
        throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
  }
  
  async updateContent(payload) {
    const { task_id, user_id, content } = payload;

    if (!ObjectId.isValid(task_id)) {
      throw new BadRequest(
        "Invalid task_id format.",
        INVALID_REQUEST_PARAMETERS
      );
    }
    if (!content) {
      throw new BadRequest(
        "Invalid request params",
        INVALID_REQUEST_PARAMETERS
      );
    }
    const task = await Task.findById(task_id);

    if (!task) {
      throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
    }
    if (task.user_id.toString() !== user_id.toString()) {
      throw new Forbidden(
        "You do not have permission to access this task.",
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
        "Invalid task_id format.",
        INVALID_REQUEST_PARAMETERS
      );
    }
    if (!category) {
      throw new BadRequest(
        "Invalid request params",
        INVALID_REQUEST_PARAMETERS
      );
    }
    const task = await Task.findById(task_id);
    if (!task) {
      throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
    }
    if (task.user_id.toString() !== user_id.toString()) {
      throw new Forbidden(
        "You do not have permission to access this task.",
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
      throw new ResourceNotFound("Task not found.", RESOURCE_NOT_FOUND);
    }
    return { updatedTaskField };
  }

  async updateStatus(payload) {
    const { task_id, user_id, status } = payload;
    if (!ObjectId.isValid(task_id)) {
      throw new BadRequest(
        "Invalid task_id format.",
        INVALID_REQUEST_PARAMETERS
      );
    }
    if (!status) {
      throw new BadRequest(
        "Invalid request params",
        INVALID_REQUEST_PARAMETERS
      );
    }
    const task = await Task.findById(task_id);
    if (!task) {
      throw new ResourceNotFound("Resource not found.", RESOURCE_NOT_FOUND);
    }
    if (task.user_id.toString() !== user_id.toString()) {
      throw new Forbidden(
        "You do not have permission to access this task.",
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
      throw new ResourceNotFound("Task not found.", RESOURCE_NOT_FOUND);
    }
    return { updatedTaskField };
  }
}

module.exports = Service;
