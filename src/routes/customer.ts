import { Router } from "express";
import CustomerController from "../controllers/CustomerController.js";

const customerRouter: Router = Router();
const controller = new CustomerController();

customerRouter.get('/', controller.index);
customerRouter.get('/:id', controller.show);
customerRouter.post('/', controller.create);
customerRouter.put('/:id', controller.update);
customerRouter.delete('/:id', controller.delete);

export default customerRouter;
