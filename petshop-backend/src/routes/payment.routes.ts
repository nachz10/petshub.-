import { FastifyInstance } from "fastify";
import {
  handleEsewaSuccess,
  handleEsewaFailure,
} from "../controllers/payment.controller";

export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.get("/esewa/success", handleEsewaSuccess);

  fastify.get("/esewa/failure", handleEsewaFailure);
}
