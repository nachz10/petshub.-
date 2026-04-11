import { FastifyInstance } from "fastify";
import {
  getServices,
  getVeterinarians,
  getAvailableTimeSlots,
  createPet,
  getUserPets,
  bookAppointment,
  getUserAppointments,
  updateAppointment,
  cancelAppointment,
} from "../controllers/appointment.controller";

export default async function appointmentRoutes(fastify: FastifyInstance) {
  fastify.get("/services", getServices);

  fastify.get("/veterinarians", getVeterinarians);
  fastify.get("/veterinarians/available", getAvailableTimeSlots);

  fastify.post("/pets", { preHandler: [fastify.authenticate] }, createPet);
  fastify.get(
    "/user/pets",
    { preHandler: [fastify.authenticate] },
    getUserPets
  );

  fastify.post(
    "/book",
    { preHandler: [fastify.authenticate] },
    bookAppointment
  );
  fastify.get(
    "/user/appointments",
    { preHandler: [fastify.authenticate] },
    getUserAppointments
  );
  fastify.put(
    "/:id",
    { preHandler: [fastify.authenticate] },
    updateAppointment
  );
  fastify.delete(
    "/:id/cancel",
    { preHandler: [fastify.authenticate] },
    cancelAppointment
  );
}
