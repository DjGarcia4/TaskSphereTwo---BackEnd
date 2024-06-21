import type { Request, Response, NextFunction } from "express";
import Task, { TasktType } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: TasktType;
    }
  }
}
export async function validateTaskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const task = await Task.findById(req.params.taskId);
  if (!task) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ error: error.message });
  }
  req.task = task;
  next();
  try {
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
export async function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.task.project.toString() !== req.project.id) {
    const error = new Error("Accion no válida");
    return res.status(400).json({ error: error.message });
  }
  next();
  try {
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
export async function hasAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.project.manager.includes(req.user.id.toString())) {
    const error = new Error("Accion no válida");
    return res.status(400).json({ error: error.message });
  }
  next();
}
