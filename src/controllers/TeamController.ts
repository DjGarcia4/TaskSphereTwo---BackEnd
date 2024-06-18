import type { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("id name email");
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(401).json({ error: error.message });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ erorr: "Hubo un error" });
    }
  };
  static addMemberById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const user = await User.findById(id).select("id name");
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(401).json({ error: error.message });
      }
      if (
        req.project.team.some(
          (member) => member.toString() === user.id.toString()
        )
      ) {
        const error = new Error(
          `${user.name} ya es colaborador en el proyecto`
        );
        return res.status(409).json({ error: error.message });
      }
      if (
        req.project.manager.some(
          (member) => member.toString() === user.id.toString()
        )
      ) {
        const error = new Error(`${user.name} ya es manager en el proyecto`);
        return res.status(409).json({ error: error.message });
      }
      req.project.team.push(user.id);
      await req.project.save();
      res.send(`Colaborador agregado correctamente!`);
    } catch (error) {
      res.status(500).json({ erorr: "Hubo un error" });
    }
  };
  static addManager = async (req: Request, res: Response) => {
    try {
      if (req.project.manager.length >= 2) {
        const error = new Error("Solo pueden haber dos managers");
        return res.status(409).json({ error: error.message });
      }
      const { id } = req.body;
      const user = await User.findById(id).select("id name");
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(409).json({ error: error.message });
      }
      if (
        req.project.manager.some(
          (member) => member.toString() === user.id.toString()
        )
      ) {
        const error = new Error(`${user.name} ya es manager en el proyecto`);
        return res.status(409).json({ error: error.message });
      }
      const memberIndex = req.project.team.findIndex(
        (member) => member.toString() === user.id.toString()
      );
      console.log(memberIndex);

      req.project.team.splice(memberIndex, 1);

      req.project.manager.push(user.id);
      await req.project.save();
      res.send(`Manager agregado correctamente!`);
    } catch (error) {
      res.status(500).json({ erorr: "Hubo un error" });
    }
  };
}
