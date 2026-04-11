import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import adminRoutes from "./routes/admin.routes";
import cartRoutes from "./routes/cart.routes";
import userRoutes from "./routes/user.routes";
import appointmentRoutes from "./routes/appointment.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import * as dotenv from "dotenv";
import path from "path";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import checkoutRoutes from "./routes/checkout.routes";

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:5111"],
  credentials: true,
});

fastify.register(fCookie, {
  secret: "some-secret-key",
  hook: "preHandler",
});

fastify.register(fjwt, {
  secret: process.env.JWT_SECRET!,
});

fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 3,
    parts: 20,
  },
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "..", "uploads"),
  prefix: "/uploads/",
});

fastify.addHook("preHandler", (req, res, next) => {
  req.jwt = fastify.jwt;
  return next();
});

fastify.decorate(
  "optionalAuth",
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token;
    if (!token) return;
    try {
      const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
      req.user = decoded;
    } catch (err) {
      reply.clearCookie("access_token");
    }
  }
);

fastify.decorate(
  "authenticateAdmin",
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.admin_access_token;
    if (!token) {
      return reply
        .status(401)
        .send({ message: "Admin authentication required" });
    }
    try {
      const decoded = req.jwt.verify<FastifyJWT["admin"]>(token);
      if (!decoded.isAdmin) {
        return reply.status(403).send({ message: "Forbidden: Not an admin" });
      }
      req.user = decoded;
    } catch (err) {
      return reply.status(401).send({ message: "Invalid or expired token" });
    }
  }
);

fastify.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token;
    if (!token) {
      return reply.status(401).send({ message: "Authentication required" });
    }
    const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
    req.user = decoded;
  }
);

fastify.register(authRoutes, { prefix: "/api/auth" });
fastify.register(productRoutes, { prefix: "/api/products" });
fastify.register(cartRoutes, { prefix: "/api/cart" });
fastify.register(appointmentRoutes, { prefix: "/api/appointments" });
fastify.register(adminRoutes, { prefix: "/api/admin" });
fastify.register(userRoutes, { prefix: "/api/users" });
fastify.register(orderRoutes, { prefix: "/api/orders" });
fastify.register(paymentRoutes, { prefix: "/api/payments" });
fastify.register(checkoutRoutes, { prefix: "/api/checkout" });

export default fastify;
