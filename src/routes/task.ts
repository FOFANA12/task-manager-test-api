// Routes de la ressource Task.
// Une route = une méthode HTTP + une URL → une méthode du controller.
import { Router } from "express";
import TaskController from "../controllers/TaskController.js";

const taskRouter = Router();
const controller = new TaskController();

taskRouter.get("/", controller.index);
taskRouter.get('/:id', controller.show);
taskRouter.post('/', controller.create);
taskRouter.put('/:id', controller.update);
taskRouter.delete('/:id', controller.delete);

export default taskRouter;
