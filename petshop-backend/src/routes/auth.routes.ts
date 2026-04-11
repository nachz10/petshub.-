import { FastifyInstance } from "fastify";
import { signup, login, me, logout } from "../controllers/auth.controller";
import {
  forgotPassword,
  validateResetToken,
  resetPasswordHandler,
} from "../controllers/password-reset.controller";
import {
  sendVerificationCode,
  verifyAndCreateUser,
} from "../controllers/email-verification.controller";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/signup", signup);
  fastify.post("/login", login);
  fastify.get("/me", { preHandler: [fastify.authenticate] }, me);
  fastify.delete("/logout", { preHandler: [fastify.authenticate] }, logout);
  fastify.post("/forgot-password", forgotPassword);
  fastify.get("/reset-password/:token", validateResetToken);
  fastify.post("/reset-password", resetPasswordHandler);
  fastify.post("/send-verification", sendVerificationCode);
  fastify.post("/verify-and-signup", verifyAndCreateUser);
}
