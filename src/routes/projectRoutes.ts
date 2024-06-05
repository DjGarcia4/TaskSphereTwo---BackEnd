import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputsError } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { taskBelongsToProject, validateTaskExists } from "../middleware/task";

const router = Router();

router.get(
  "/",

  ProjectController.getAllProjects
);
router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputsError,
  ProjectController.getProjectById
);
router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputsError,
  ProjectController.createProject
);
router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputsError,
  ProjectController.updateProjectById
);
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputsError,
  ProjectController.deleteProject
);

//Router for Tasks
router.param("projectId", validateProjectExists);
router.param("taskId", validateTaskExists);
router.param("taskId", taskBelongsToProject);
router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputsError,
  TaskController.createTask
);
router.get(
  "/:projectId/tasks",
  param("id").isMongoId().withMessage("ID no válido"),
  TaskController.getProjectTasks
);
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),
  TaskController.getTaskById
);
router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputsError,
  TaskController.updateTask
);
router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputsError,
  TaskController.deleteTask
);
router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handleInputsError,
  TaskController.updateStatus
);
export default router;
