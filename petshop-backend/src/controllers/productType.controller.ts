import { FastifyRequest, FastifyReply } from "fastify";
import * as productTypeService from "../services/productType.service";

export const getAllProductTypes = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const productTypes = await productTypeService.getAllProductTypes();
    reply.send({ productTypes });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching product types" });
  }
};

export const getProductType = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const productType = await productTypeService.getProductTypeById(
      req.params.id
    );
    if (!productType)
      return reply.status(404).send({ message: "Product type not found" });
    reply.send({ productType });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching product type" });
  }
};

export const createProductType = async (
  req: FastifyRequest<{
    Body: { name: string; description?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const newProductType = await productTypeService.createProductType(req.body);
    reply.status(201).send({ productType: newProductType });
  } catch (error) {
    reply.status(500).send({ message: "Error creating product type" });
  }
};

export const updateProductType = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: { name?: string; description?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const updated = await productTypeService.updateProductType(
      req.params.id,
      req.body
    );
    reply.send({ productType: updated });
  } catch (error) {
    reply.status(500).send({ message: "Error updating product type" });
  }
};

export const deleteProductType = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    await productTypeService.deleteProductType(req.params.id);
    reply.send({ message: "Product type deleted successfully" });
  } catch (error) {
    reply.status(500).send({ message: "Error deleting product type" });
  }
};
