import { FastifyRequest, FastifyReply } from "fastify";
import * as productService from "../services/new-product.Service";

interface MultipartPart {
  type: "file" | "field";
  fieldname: string;
  filename?: string;
  mimetype?: string;
  encoding?: string;
  file?: NodeJS.ReadableStream;
  value?: any;
}

export const createProduct = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const parts = req.parts() as AsyncIterableIterator<MultipartPart>;
    const productData: any = { animalTargetIds: [], attributes: [] };
    const filesToProcess: {
      stream: NodeJS.ReadableStream;
      filename: string;
      mimetype: string;
    }[] = [];
    let primaryImageIndexStr: string | undefined;

    for await (const part of parts) {
      if (
        part.type === "file" &&
        part.fieldname === "newImages" &&
        part.file &&
        part.filename &&
        part.mimetype
      ) {
        filesToProcess.push({
          stream: part.file,
          filename: part.filename,
          mimetype: part.mimetype,
        });
      } else if (part.type === "field") {
        const { fieldname, value } = part;
        if (fieldname === "animalTargetIds[]") {
          productData.animalTargetIds.push(value);
        } else if (fieldname === "attributes") {
          try {
            productData.attributes = JSON.parse(value as string);
          } catch (e) {
            console.error("Malformed attributes JSON:", value, e);
            return reply
              .status(400)
              .send({ message: "Invalid format for attributes." });
          }
        } else if (fieldname === "primaryImageIndex") {
          primaryImageIndexStr = value as string;
        } else if (
          ["isFeatured", "freeShipping", "returnPolicy"].includes(fieldname)
        ) {
          productData[fieldname] = value === "true";
        } else {
          productData[fieldname] = value;
        }
      }
    }

    if (
      !productData.name ||
      !productData.price ||
      !productData.availableUnits ||
      !productData.categoryId ||
      !productData.productTypeId
    ) {
      return reply
        .status(400)
        .send({ message: "Missing required product fields." });
    }
    if (filesToProcess.length === 0) {
      return reply
        .status(400)
        .send({ message: "At least one image file is required." });
    }
    if (filesToProcess.length > 3) {
      return reply
        .status(400)
        .send({ message: "Maximum of 3 image files allowed." });
    }

    if (productData.price) productData.price = parseFloat(productData.price);
    if (productData.availableUnits)
      productData.availableUnits = parseInt(productData.availableUnits, 10);

    const primaryImageIndex = primaryImageIndexStr
      ? parseInt(primaryImageIndexStr, 10)
      : undefined;

    const newProduct = await productService.createProduct(
      productData,
      filesToProcess,
      primaryImageIndex
    );
    reply.status(201).send({ product: newProduct });
  } catch (error: any) {
    console.error("Controller Error: createProduct:", error);
    if (
      error.code === "FST_PARTS_LIMIT" ||
      error.code === "FST_FILES_LIMIT" ||
      error.code === "FST_FIELD_LIMIT" ||
      error.code === "FST_MAX_FIELDS_LIMIT"
    ) {
      return reply
        .status(413)
        .send({ message: `Upload limit exceeded: ${error.message}` });
    }
    if (
      error.code === "ERR_STREAM_PREMATURE_CLOSE" ||
      error.message?.includes("Request aborted")
    ) {
      return reply.status(400).send({
        message: "Upload interrupted or file stream closed prematurely.",
      });
    }
    reply.status(error.statusCode || 500).send({
      message: error.message || "Failed to create product. Please try again.",
    });
  }
};

export const updateProduct = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const productId = req.params.id;
  try {
    const parts = req.parts() as AsyncIterableIterator<MultipartPart>;
    const productData: any = { imageIdsToDelete: [] }; // Initialize to ensure it's an array
    const filesToProcess: {
      stream: NodeJS.ReadableStream;
      filename: string;
      mimetype: string;
    }[] = [];

    for await (const part of parts) {
      if (
        part.type === "file" &&
        part.fieldname === "newImages" &&
        part.file &&
        part.filename &&
        part.mimetype
      ) {
        filesToProcess.push({
          stream: part.file,
          filename: part.filename,
          mimetype: part.mimetype,
        });
      } else if (part.type === "field") {
        const { fieldname, value } = part;
        if (fieldname === "animalTargetIds[]") {
          if (!productData.animalTargetIds) productData.animalTargetIds = [];
          productData.animalTargetIds.push(value);
        } else if (fieldname === "imageIdsToDelete[]") {
          productData.imageIdsToDelete.push(value);
        } else if (
          fieldname === "attributes" ||
          fieldname === "primaryImageDesignation"
        ) {
          try {
            productData[fieldname] = JSON.parse(value as string);
          } catch (e) {
            console.error(`Malformed JSON for ${fieldname}:`, value, e);
            return reply
              .status(400)
              .send({ message: `Invalid format for ${fieldname}.` });
          }
        } else if (
          ["isFeatured", "freeShipping", "returnPolicy"].includes(fieldname)
        ) {
          productData[fieldname] = value === "true";
        } else {
          productData[fieldname] = value;
        }
      }
    }

    if (productData.price) productData.price = parseFloat(productData.price);
    if (productData.availableUnits)
      productData.availableUnits = parseInt(productData.availableUnits, 10);

    if (filesToProcess.length > 3) {
      return reply
        .status(400)
        .send({ message: "Cannot upload more than 3 new images at a time." });
    }

    const updatedProduct = await productService.updateProduct(
      productId,
      productData,
      filesToProcess
    );
    reply.send({ product: updatedProduct });
  } catch (error: any) {
    console.error(`Controller Error: updateProduct for ${productId}:`, error);
    if (
      error.code === "FST_PARTS_LIMIT" ||
      error.code === "FST_FILES_LIMIT" ||
      error.code === "FST_FIELD_LIMIT" ||
      error.code === "FST_MAX_FIELDS_LIMIT"
    ) {
      return reply
        .status(413)
        .send({ message: `Upload limit exceeded: ${error.message}` });
    }
    if (
      error.code === "ERR_STREAM_PREMATURE_CLOSE" ||
      error.message?.includes("Request aborted")
    ) {
      return reply.status(400).send({
        message: "Upload interrupted or file stream closed prematurely.",
      });
    }
    reply.status(error.statusCode || 500).send({
      message: error.message || "Failed to update product. Please try again.",
    });
  }
};

export const getAllProducts = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const products = await productService.getAllProducts();
    reply.send({ products });
  } catch (error: any) {
    console.error("Controller Error: getAllProducts:", error);
    reply
      .status(error.statusCode || 500)
      .send({ message: error.message || "Error fetching products" });
  }
};

export const getProduct = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const product = await productService.getProductById(req.params.id);
    reply.send({ product });
  } catch (error: any) {
    console.error(`Controller Error: getProduct for ${req.params.id}:`, error);
    reply
      .status(error.statusCode || 500)
      .send({ message: error.message || "Error fetching product" });
  }
};

export const deleteProduct = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    await productService.deleteProduct(req.params.id);
    reply.send({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error(
      `Controller Error: deleteProduct for ${req.params.id}:`,
      error
    );
    reply
      .status(error.statusCode || 500)
      .send({ message: error.message || "Error deleting product" });
  }
};
