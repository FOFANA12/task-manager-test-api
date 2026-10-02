import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import ProjectRepository from "../repositories/ProjectRepository.js";

export default class ProjectController {
  // GET /projects
  index = async (_req: Request, res: Response) => {
    const projects = await ProjectRepository.findAll();

    res.status(StatusCodes.OK).json({ projects });
  };

  // GET /projects/:id
  show = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const project = await ProjectRepository.findById(id);

    res.status(StatusCodes.OK).json({ project });
  };

  // POST /projects
  create = async (req: Request, res: Response) => {
    const { name, description, status } = req.body;
    const startDate = req.body.start_date;
    const dueDate = req.body.due_date;
    const amountExclTax = req.body.amount_excl_tax;
    const vatRate = req.body.vat_rate;
    const customerId = req.body.customer_id;

    const project = await ProjectRepository.create({
      name,
      description,
      status,
      ...(amountExclTax !== undefined && { amountExclTax }),
      ...(vatRate !== undefined && { vatRate }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      dueDate: new Date(dueDate),
      customerId: Number(customerId),
    });

    res.status(StatusCodes.CREATED).json({
      message: "Project has been successfully created",
      project,
    });
  };

  // PUT /projects/:id
  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, description, status } = req.body;
    const startDate = req.body.start_date;
    const dueDate = req.body.due_date;
    const amountExclTax = req.body.amount_excl_tax;
    const vatRate = req.body.vat_rate;
    const customerId = req.body.customer_id;

    const project = await ProjectRepository.update(id, {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(amountExclTax !== undefined && { amountExclTax }),
      ...(vatRate !== undefined && { vatRate }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      ...(customerId !== undefined && { customerId: Number(customerId) }),
    });

    res.status(StatusCodes.OK).json({
      message: "Project has been successfully updated",
      project,
    });
  };

  // DELETE /projects/:id
  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await ProjectRepository.delete(id);

    res.status(StatusCodes.OK).json({
      message: "Project has been successfully deleted",
    });
  };
}
