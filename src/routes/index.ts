import { Router } from "express";
import taskRouter from "./task.js";
import projectRouter from "./project.js";
import customerRouter from "./customer.js";

const appRouter = Router();

appRouter.use('/customers', customerRouter);
appRouter.use('/projects', projectRouter);
appRouter.use('/tasks', taskRouter);

export default appRouter;
