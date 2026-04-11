import { FastifyRequest, FastifyReply } from "fastify";
import * as categoryService from "../services/categories.service";

export const getAllCategories = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const categories = await categoryService.getAllCategories();
    reply.send({ categories });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching categories" });
  }
};

export const getCategory = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category)
      return reply.status(404).send({ message: "Category not found" });
    reply.send({ category });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching category" });
  }
};

export const createCategory = async (
  req: FastifyRequest<{
    Body: { name: string; description?: string; imageUrl?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    reply.status(201).send({ category: newCategory });
  } catch (error) {
    reply.status(500).send({ message: "Error creating category" });
  }
};

export const updateCategory = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: { name?: string; description?: string; imageUrl?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const updated = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    reply.send({ category: updated });
  } catch (error) {
    reply.status(500).send({ message: "Error updating category" });
  }
};

export const deleteCategory = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    reply.send({ message: "Category deleted successfully" });
  } catch (error) {
    reply.status(500).send({ message: "Error deleting category" });
  }
};
