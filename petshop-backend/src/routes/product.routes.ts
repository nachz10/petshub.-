import { FastifyInstance } from "fastify";
import {
  addProduct,
  getProduct,
  getAllProductsHandler,
  editProduct,
  removeProduct,
  getAllCategoriesHandler,
  getProductsByCategory,
  searchProducts,
  getFeaturedCategoriesHandler,
  getFeaturedProductsHandler,
  createProductReview,
  getShowInNavCategoriesHandler,
} from "../controllers/product.controller";

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.post("/", addProduct);
  fastify.get("/:id", { preHandler: [fastify.optionalAuth] }, getProduct);
  fastify.get("/", getAllProductsHandler);
  fastify.get("/categories", getAllCategoriesHandler);
  fastify.get("/featuredCategories", getFeaturedCategoriesHandler);
  fastify.get("/navCategories", getShowInNavCategoriesHandler);
  fastify.get("/featuredProducts", getFeaturedProductsHandler);
  fastify.get("/categories/:categoryId", getProductsByCategory);
  fastify.put("/:id", editProduct);
  fastify.get("/search", searchProducts);
  fastify.delete("/:id", removeProduct);
  fastify.post(
    "/:productId/reviews",
    { preHandler: [fastify.authenticate] },
    createProductReview
  );
}
