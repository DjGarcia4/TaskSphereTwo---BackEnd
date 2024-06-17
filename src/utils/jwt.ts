import jwt from "jsonwebtoken";
export const generateJWT = () => {
  const data = {
    nombre: "Jared",
  };
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};
