import { FastifyInstance } from "fastify";
import {
  getUserCart,
  addItem,
  updateItem,
  removeItem,
  clearallItem,
} from "../controllers/cart.controller";

export default async function cartRoutes(fastify: FastifyInstance) {
  fastify.get("/", { preHandler: [fastify.authenticate] }, getUserCart);

  fastify.post("/add", { preHandler: [fastify.authenticate] }, addItem);

  fastify.put("/item/:id", { preHandler: [fastify.authenticate] }, updateItem);

  fastify.delete(
    "/item/:id",
    { preHandler: [fastify.authenticate] },
    removeItem
  );
  fastify.delete("/", { preHandler: [fastify.authenticate] }, clearallItem);
}
