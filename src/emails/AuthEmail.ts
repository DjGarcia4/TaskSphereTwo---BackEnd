import { transport } from "../config/nodemailer";
import { TokenType } from "../models/Token";
import { UserType } from "../models/User";

type EmailType = {
  email: UserType["email"];
  name: UserType["name"];
  token: TokenType["token"];
};

export class AuthEmail {
  static sendConfirmation = async (user: EmailType) => {
    const info = await transport.sendMail({
      from: "TaskSphere <admin@tasksphere.com>",
      to: user.email,
      subject: "TaskSphere - Confirma tu cuenta",
      text: "TaskSphere - Confirma tu cuenta",
      html: `<p>Hola ${user.name}, has creado tu cuenta en TaskSphere, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
      <p>Visita el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
      <p>E ingresa el código: <b>${user.token}</b></p>
      <p>Este token expira en 10 minutos</p>
      `,
    });
    console.log("Mensaje enviado", info.messageId);
  };
}
