import { FastifyRequest, FastifyReply } from "fastify";
import * as veterinarianService from "../services/veterinarian.service";

export const getAllVeterinarians = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const veterinarians = await veterinarianService.getAllVeterinarians();
    reply.send({ veterinarians });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching veterinarians" });
  }
};

export const getVeterinarian = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const veterinarian = await veterinarianService.getVeterinarianById(
      req.params.id
    );
    if (!veterinarian)
      return reply.status(404).send({ message: "Veterinarian not found" });
    reply.send({ veterinarian });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching veterinarian" });
  }
};

export const createVeterinarian = async (
  req: FastifyRequest<{
    Body: {
      fullName: string;
      speciality?: string;
      bio?: string;
      imageUrl?: string;
      isAvailable?: boolean;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const newVeterinarian = await veterinarianService.createVeterinarian(
      req.body
    );
    reply.status(201).send({ veterinarian: newVeterinarian });
  } catch (error) {
    reply.status(500).send({ message: "Error creating veterinarian" });
  }
};

export const updateVeterinarian = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: {
      fullName?: string;
      speciality?: string;
      bio?: string;
      imageUrl?: string;
      isAvailable?: boolean;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const updated = await veterinarianService.updateVeterinarian(
      req.params.id,
      req.body
    );
    reply.send({ veterinarian: updated });
  } catch (error) {
    reply.status(500).send({ message: "Error updating veterinarian" });
  }
};

export const deleteVeterinarian = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    await veterinarianService.deleteVeterinarian(req.params.id);
    reply.send({ message: "Veterinarian deleted successfully" });
  } catch (error) {
    reply.status(500).send({ message: "Error deleting veterinarian" });
  }
};
