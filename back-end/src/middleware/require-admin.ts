import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user || req.session.user.role != "admin") {
    res.status(401).json({
      success: false,
      message: "Admin access required.",
    });

    return;
  }

  next();
};