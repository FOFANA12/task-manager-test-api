import { Router } from "express";
import ProjectController from "../controllers/ProjectController.js";

const projectRouter: Router = Router();
const controller = new ProjectController();

projectRouter.get('/', controller.index);
projectRouter.get('/:id', controller.show);
projectRouter.post('/', controller.create);
projectRouter.put('/:id', controller.update);
projectRouter.delete('/:id', controller.delete);

export default projectRouter;
