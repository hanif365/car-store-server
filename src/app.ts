import cors from "cors";
import express, { Application, Request, Response } from "express";

import notFound from "./app/middleware/notFound";
import routes from "./app/routes";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Welcome route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to our Car Store Server API",
    version: "1.0.0",
    API_documentation: "",
    success: true,
  });
});

// application routes
app.use("/api", routes);

// not found handler
app.use(notFound);

export default app;
