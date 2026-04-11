import { FastifyRequest, FastifyReply } from "fastify";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/auth.service";
import { hashPassword, comparePassword } from "../utils/jwt.utils";

export const signup = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, fullName, password } = req.body as any;

  const hashedPassword = await hashPassword(password);
  const user = await createUser({
    email,
    fullName,
    password: hashedPassword,
  });

  reply.send({ user });
};

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as any;

  const user = await findUserByEmail(email);
  if (!user) {
    return reply.status(404).send({ message: "User not found" });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return reply.status(400).send({ message: "Invalid credentials" });
  }
  const payload = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  };
  const token = req.jwt.sign(payload);
  reply.setCookie("access_token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
  reply.send({ user });
};

export const me = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = req.user.id;
  const user = await findUserById(userId);

  if (!user) {
    return reply.status(404).send({ message: "User not found" });
  }

  reply.send({ user });
};

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("access_token");
  return reply.send({ message: "Logout successful" });
}
