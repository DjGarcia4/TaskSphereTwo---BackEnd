import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputsError } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no son iguales");
    }
    return true;
  }),
  body("email").isEmail().withMessage("El E-mail es invalido"),
  handleInputsError,
  AuthController.createAccount
);
router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token no puede ir vacio"),
  handleInputsError,
  AuthController.confirmAccount
);
router.post(
  "/login",
  body("email").isEmail().withMessage("El E-mail es invalido"),
  body("password").notEmpty().withMessage("La contraseña no puede ir vacia"),
  handleInputsError,
  AuthController.login
);
router.post(
  "/request-code",
  body("email").isEmail().withMessage("El E-mail es invalido"),
  handleInputsError,
  AuthController.requestConfirmationCode
);
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("El E-mail es invalido"),
  handleInputsError,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El token no puede ir vacio"),
  handleInputsError,
  AuthController.validateToken
);
router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Token no valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no son iguales");
    }
    return true;
  }),
  handleInputsError,
  AuthController.updatePasswordWithToken
);

router.get("/user", authenticate, AuthController.user);

// Profile
router.put(
  "/profile",
  authenticate,
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("email").isEmail().withMessage("El E-mail es invalido"),
  handleInputsError,
  AuthController.updateProfile
);
router.post(
  "/update-password",
  authenticate,
  body("current_password")
    .notEmpty()
    .withMessage("El password actual no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no son iguales");
    }
    return true;
  }),
  handleInputsError,
  AuthController.updateCurrentUserPassword
);

router.post(
  "/check-password",
  authenticate,
  body("password").notEmpty().withMessage("El password no puede ir vacio"),
  handleInputsError,
  AuthController.checkPassword
);

export default router;
