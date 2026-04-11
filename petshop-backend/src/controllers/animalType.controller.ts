import { FastifyRequest, FastifyReply } from "fastify";
import * as animalTypeService from "../services/animalType.service";

export const getAllAnimalTypes = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const animalTypes = await animalTypeService.getAllAnimalTypes();
    reply.send({ animalTypes });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching animal types" });
  }
};

export const getAnimalType = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const animalType = await animalTypeService.getAnimalTypeById(req.params.id);
    if (!animalType)
      return reply.status(404).send({ message: "Animal type not found" });
    reply.send({ animalType });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching animal type" });
  }
};

export const createAnimalType = async (
  req: FastifyRequest<{
    Body: { name: string; description?: string; imageUrl?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const newAnimalType = await animalTypeService.createAnimalType(req.body);
    reply.status(201).send({ animalType: newAnimalType });
  } catch (error) {
    reply.status(500).send({ message: "Error creating animal type" });
  }
};

export const updateAnimalType = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: { name?: string; description?: string; imageUrl?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const updated = await animalTypeService.updateAnimalType(
      req.params.id,
      req.body
    );
    reply.send({ animalType: updated });
  } catch (error) {
    reply.status(500).send({ message: "Error updating animal type" });
  }
};

export const deleteAnimalType = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    await animalTypeService.deleteAnimalType(req.params.id);
    reply.send({ message: "Animal type deleted successfully" });
  } catch (error) {
    reply.status(500).send({ message: "Error deleting animal type" });
  }
};
