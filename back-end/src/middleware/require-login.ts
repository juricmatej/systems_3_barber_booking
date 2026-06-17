import { Request, Response, NextFunction } from "express";

export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) {
    res.status(401).json({
      success: false,
      message: "You must be logged in to access this endpoint.",
    });

    return;
  }

  next();
};