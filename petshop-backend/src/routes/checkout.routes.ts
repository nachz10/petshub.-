import { FastifyInstance } from "fastify";
import {
  initiatePayment,
  verifyEsewaPayment,
  handleEsewaFailure,
} from "../controllers/NewCheckoutController";

export default async function checkoutRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/initiate-payment",
    { preHandler: [fastify.authenticate] },
    initiatePayment
  );

  fastify.get("/esewa/verify", verifyEsewaPayment);

  fastify.get("/esewa/failure", handleEsewaFailure);
}
