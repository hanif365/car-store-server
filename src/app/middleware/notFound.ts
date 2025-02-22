import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../config";

const notFound = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    statusCode: StatusCodes.NOT_FOUND,
    error: [{ details: [{ path: req.originalUrl, message: "API not found!" }] }],
    stack: config.env === "development" ? new Error().stack : null,
  });
};

export default notFound;
