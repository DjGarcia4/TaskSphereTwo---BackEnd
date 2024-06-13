import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;
      //Prevenir usuarios duplicados
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("El usuario ya esta registrado.");
        return res.status(409).json({ error: error.message });
      }
      //Crear Usuario
      const user = new User(req.body);
      //Hash Password
      user.password = await hashPassword(password);
      //Generar Token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      //Enviar emial
      AuthEmail.sendConfirmation({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);
      res.send("Cuenta registrada, revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("El token no es valido o ya expiro");
        return res.status(404).json({ error: error.message });
      }
      const userExist = await User.findById(tokenExist.user);
      if (!userExist) {
        const error = new Error("Usuario no encontrado");
        return res.status(401).json({ error: error.message });
      }
      userExist.confirmed = true;
      await Promise.allSettled([userExist.save(), tokenExist.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();
        //Enviar emial
        AuthEmail.sendConfirmation({
          email: user.email,
          name: user.name,
          token: token.token,
        });
        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmacion"
        );
        return res.status(401).json({ error: error.message });
      }
      //Revisar Password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Contraseña Incorrecta");
        return res.status(401).json({ error: error.message });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
