import type { Request, Response, NextFunction } from "express";
import Project, { ProjectType } from "../models/Project";

declare global {
  namespace Express {
    interface Request {
      project: ProjectType;
    }
  }
}
export async function validateProjectExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ error: error.message });
  }
  req.project = project;
  next();
  try {
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
