import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import { StatusCodes } from 'http-status-codes';
import "dotenv/config";

const { API_VERSION } = process.env;

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Task Manager API is running", version: API_VERSION });
});

// Toutes les routes de l'API sont préfixées par API_VERSION (ex. : /api/v1)
app.use(API_VERSION as string, appRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
});

export default app;
