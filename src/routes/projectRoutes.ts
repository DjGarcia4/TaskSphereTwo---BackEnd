import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputsError } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  validateTaskExists,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";

const router = Router();

router.use(authenticate);

router.get("/", ProjectController.getAllProjects);
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
  hasAuthorization,
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
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputsError,
  TaskController.updateTask
);
router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
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
router.post(
  "/:projectId/tasks/:taskId/assigne",
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("assignedTo")
    .notEmpty()
    .withMessage("Ees obligatorio asignar la tarea a un miembro"),
  handleInputsError,
  TaskController.updateAssigned
);

//Routes for team
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("E-mail no válido"),
  handleInputsError,
  TeamMemberController.findMemberByEmail
);
router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("ID no Válido"),
  handleInputsError,
  TeamMemberController.addMemberById
);
router.get(
  "/:projectId/team",

  TeamMemberController.getMembers
);
router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("ID no Válido"),
  handleInputsError,
  TeamMemberController.removeMemberById
);
router.post(
  "/:projectId/team/manager",
  body("id").isMongoId().withMessage("ID no Válido"),
  handleInputsError,
  TeamMemberController.addManager
);

export default router;
