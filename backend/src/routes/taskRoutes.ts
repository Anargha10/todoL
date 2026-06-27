import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { validateRequest, validateQuery } from '../middlewares/validateRequest';
import { createTaskSchema, updateTaskSchema, taskFiltersSchema, bulkActionSchema } from '../validators/taskValidator';
import { createTaskLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.get('/', validateQuery(taskFiltersSchema), TaskController.getAllTasks);
router.post('/', createTaskLimiter, validateRequest(createTaskSchema), TaskController.createTask);
router.post('/bulk-delete', validateRequest(bulkActionSchema), TaskController.bulkDelete);
router.post('/bulk-complete', validateRequest(bulkActionSchema), TaskController.bulkComplete);
router.get('/:id', TaskController.getTaskById);
router.patch('/:id', validateRequest(updateTaskSchema), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
router.post('/:id/duplicate', TaskController.duplicateTask);

export default router;
