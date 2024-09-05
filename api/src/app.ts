import express, { Request, Response, NextFunction } from "express";
import { logger } from "@/config";
import { CustomError } from "@/types";
import {
  articleRoutes,
  bookRoutes,
  caseRoutes,
  referenceRoutes,
} from "@/routes";
import cors from "cors";

const app = express();

const corsOptions = {
  origin:
    " https://639d-2a02-8109-ba00-8100-b423-65b6-f77a-a9f8.ngrok-free.app", // Replace with your client's origin
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};
app.use(cors());

// Log all requests
app.use((req, _, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use("/articles", articleRoutes);
app.use("/cases", caseRoutes);
app.use("/books", bookRoutes);
app.use("/references", referenceRoutes);

// Error handling
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send("Something went wrong!");
});

export default app;
