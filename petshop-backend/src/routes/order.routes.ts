import { FastifyInstance } from "fastify";
import {
  createCartOrder,
  createProductOrder,
  getOrders,
  getOrder,
} from "../controllers/order.controller";

export default async function orderRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/cart",
    { preHandler: [fastify.authenticate] },
    createCartOrder
  );

  fastify.post(
    "/product",
    { preHandler: [fastify.authenticate] },
    createProductOrder
  );

  fastify.get("/", { preHandler: [fastify.authenticate] }, getOrders);

  fastify.get("/:id", { preHandler: [fastify.authenticate] }, getOrder);
}
