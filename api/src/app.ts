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
