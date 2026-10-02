import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import CustomerRepository from "../repositories/CustomerRepository.js";

export default class CustomerController {
  // GET /customers
  index = async (_req: Request, res: Response) => {
    const customers = await CustomerRepository.findAll();

    res.status(StatusCodes.OK).json({ customers });
  };

  // GET /customers/:id
  show = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const customer = await CustomerRepository.findById(id);

    res.status(StatusCodes.OK).json({ customer });
  };

  // POST /customers
  create = async (req: Request, res: Response) => {
    const { name, email, phone, address } = req.body;

    const customer = await CustomerRepository.create({
      name,
      email,
      phone,
      address,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Customer has been successfully created",
      customer,
    });
  };

  // PUT /customers/:id
  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, email, phone, address } = req.body;

    const customer = await CustomerRepository.update(id, {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
    });

    res.status(StatusCodes.OK).json({
      message: "Customer has been successfully updated",
      customer,
    });
  };

  // DELETE /customers/:id
  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await CustomerRepository.delete(id);

    res.status(StatusCodes.OK).json({
      message: "Customer has been successfully deleted",
    });
  };
}
