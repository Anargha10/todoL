import { Task } from '../models/Task';
import { ITaskInput, ITaskUpdate, ITaskFilters, TaskStatus, ITask } from '../types';
import { ApiError } from '../utils/ApiResponse';

export class TaskService {
  static async createTask(input: ITaskInput): Promise<ITask> {
    const task = new Task({
      ...input,
      dueDate: new Date(input.dueDate),
      completedAt: input.status === TaskStatus.COMPLETED ? new Date() : null,
    });
    const savedTask = await task.save();
    return savedTask.toJSON() as ITask;
  }

  static async getAllTasks(filters: ITaskFilters) {
    const { status, priority, category, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = filters;

    const query: any = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [tasks, totalCount] = await Promise.all([
      Task.find(query).sort(sort).skip(skip).limit(limit).lean().exec(),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      tasks: tasks.map((task) => ({
        ...task,
        id: task.id || (task._id as any).toString(),
      })) as ITask[],
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getTaskById(id: string): Promise<ITask> {
    const task = await Task.findOne({ id }).lean().exec();
    if (!task) {
      throw ApiError.notFound(`Task with id '${id}' not found`);
    }
    return { ...task, id: task.id || (task._id as any).toString() } as ITask;
  }

  static async updateTask(id: string, update: ITaskUpdate): Promise<ITask> {
    const existingTask = await Task.findOne({ id }).exec();
    if (!existingTask) {
      throw ApiError.notFound(`Task with id '${id}' not found`);
    }

    const updateData: any = { ...update };
    if (update.dueDate) {
      updateData.dueDate = new Date(update.dueDate);
    }
    if (update.status === TaskStatus.COMPLETED && existingTask.status !== TaskStatus.COMPLETED) {
      updateData.completedAt = new Date();
    } else if (update.status && update.status !== TaskStatus.COMPLETED) {
      updateData.completedAt = null;
    }

    const updatedTask = await Task.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true }).lean().exec();
    if (!updatedTask) {
      throw ApiError.notFound(`Task with id '${id}' not found`);
    }
    return { ...updatedTask, id: updatedTask.id || (updatedTask._id as any).toString() } as ITask;
  }

  static async deleteTask(id: string): Promise<void> {
    const result = await Task.findOneAndDelete({ id }).exec();
    if (!result) {
      throw ApiError.notFound(`Task with id '${id}' not found`);
    }
  }

  static async duplicateTask(id: string): Promise<ITask> {
    const originalTask = await Task.findOne({ id }).lean().exec();
    if (!originalTask) {
      throw ApiError.notFound(`Task with id '${id}' not found`);
    }

    const { _id, id: _originalId, createdAt, updatedAt, completedAt, ...taskData } = originalTask;
    const newTask = new Task({
      ...taskData,
      title: `${taskData.title} (Copy)`,
      status: TaskStatus.TODO,
      completedAt: null,
    });
    const savedTask = await newTask.save();
    return savedTask.toJSON() as ITask;
  }

  static async bulkDelete(ids: string[]): Promise<number> {
    const result = await Task.deleteMany({ id: { $in: ids } }).exec();
    return result.deletedCount || 0;
  }

  static async bulkComplete(ids: string[]): Promise<number> {
    const result = await Task.updateMany(
      { id: { $in: ids } },
      { status: TaskStatus.COMPLETED, completedAt: new Date() }
    ).exec();
    return result.modifiedCount || 0;
  }
}
