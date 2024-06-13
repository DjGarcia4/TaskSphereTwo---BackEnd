import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputsError } from "../middleware/validation";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre no puede ir vacio."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta, minimo 8 caracteres."),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no son iguales. ");
    }
    return true;
  }),
  body("email").isEmail().withMessage("El E-mail es invalido."),
  handleInputsError,
  AuthController.createAccount
);

export default router;
