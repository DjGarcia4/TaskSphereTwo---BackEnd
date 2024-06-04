import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputsError } from "../middleware/validation";

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

export default router;
