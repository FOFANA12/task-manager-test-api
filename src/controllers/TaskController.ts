import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import TaskRepository from "../repositories/TaskRepository.js";

export default class TaskController {
  // GET /tasks
  index = async (_req: Request, res: Response) => {
    const tasks = await TaskRepository.findAll();

    res.status(StatusCodes.OK).json({ tasks });
  };

  // GET /tasks/:id
  show = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const task = await TaskRepository.findById(id);

    res.status(StatusCodes.OK).json({ task });
  };

  // POST /tasks
  create = async (req: Request, res: Response) => {
    const { title, description, status, priority, project_id } = req.body;
    const dueDate = req.body.due_date;

    const task = await TaskRepository.create({
      title,
      description,
      status,
      priority,
      dueDate: new Date(dueDate),
      projectId: project_id ? Number(project_id) : null,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Task has been successfully created",
      task,
    });
  };

  // PUT /tasks/:id
  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, description, status, priority, project_id } = req.body;
    const dueDate = req.body.due_date;

    const task = await TaskRepository.update(id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      ...(project_id !== undefined && {
        projectId: project_id ? Number(project_id) : null,
      }),
    });

    res.status(StatusCodes.OK).json({
      message: "Task has been successfully updated",
      task,
    });
  };

  // DELETE /tasks/:id
  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await TaskRepository.delete(id);

    res.status(StatusCodes.OK).json({
      message: "Task has been successfully deleted",
    });
  };
}
