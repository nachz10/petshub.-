import { FastifyInstance } from "fastify";
import {
  getAllUsers,
  adminLogin,
  verifyAdmin,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAllOrdersAdmin,
  updateOrderDeliveryStatus,
  cancelOrderAdmin,
} from "../controllers/admin.controller";
import {
  getDashboardSummary,
  getSalesOverTime,
  getTopSellingProducts,
  getOrderStatusDistribution,
  getLowStockProducts,
} from "../controllers/analytics.controller";
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller";

import * as productController from "../controllers/newProduct.controller";

import {
  getSupportChats,
  getChatMessages,
  markMessagesAsRead,
  resolveChat,
  sendAdminMessage,
} from "../controllers/support.controller";

import {
  getAllProductTypes,
  getProductType,
  createProductType,
  updateProductType,
  deleteProductType,
} from "../controllers/productType.controller";

import {
  getAllAnimalTypes,
  getAnimalType,
  createAnimalType,
  updateAnimalType,
  deleteAnimalType,
} from "../controllers/animalType.controller";

import {
  getAllVeterinarians,
  getVeterinarian,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
} from "../controllers/veterinarian.controller";

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/orders",
    { preHandler: [fastify.authenticateAdmin] },
    getAllOrdersAdmin
  );
  fastify.patch(
    "/orders/:orderId/delivery-status",
    { preHandler: [fastify.authenticateAdmin] },
    updateOrderDeliveryStatus
  );
  fastify.patch(
    "/orders/:orderId/cancel",
    { preHandler: [fastify.authenticateAdmin] },
    cancelOrderAdmin
  );
  fastify.get(
    "/analytics/summary",
    { preHandler: [fastify.authenticateAdmin] },
    getDashboardSummary
  );
  fastify.get(
    "/analytics/sales-over-time",
    { preHandler: [fastify.authenticateAdmin] },
    getSalesOverTime
  );
  fastify.get(
    "/analytics/top-selling-products",
    { preHandler: [fastify.authenticateAdmin] },
    getTopSellingProducts
  );
  fastify.get(
    "/analytics/order-status-distribution",
    { preHandler: [fastify.authenticateAdmin] },
    getOrderStatusDistribution
  );
  fastify.get(
    "/analytics/low-stock-products",
    { preHandler: [fastify.authenticateAdmin] },
    getLowStockProducts
  );
  fastify.get("/appointments", getAllAppointments);
  fastify.patch(
    "/appointments/:id/status",
    { preHandler: [fastify.authenticateAdmin] },
    updateAppointmentStatus
  );
  fastify.delete(
    "/appointments/:id",
    { preHandler: [fastify.authenticateAdmin] },
    deleteAppointment
  );
  fastify.post("/login", adminLogin);
  fastify.get(
    "/verify",
    { preHandler: [fastify.authenticateAdmin] },
    verifyAdmin
  );
  fastify.get("/users", getAllUsers);
  fastify.get("/products", productController.getAllProducts);
  fastify.post("/products", productController.createProduct);
  fastify.get("/products/:id", productController.getProduct);
  fastify.put("/products/:id", productController.updateProduct);
  fastify.delete("/products/:id", productController.deleteProduct);
  fastify.get("/categories", getAllCategories);
  fastify.get("/categories/:id", getCategory);
  fastify.post("/categories", createCategory);
  fastify.put("/categories/:id", updateCategory);
  fastify.delete("/categories/:id", deleteCategory);
  fastify.get("/product-types", getAllProductTypes);
  fastify.get("/product-types/:id", getProductType);
  fastify.post("/product-types", createProductType);
  fastify.put("/product-types/:id", updateProductType);
  fastify.delete("/product-types/:id", deleteProductType);
  fastify.get("/animal-types", getAllAnimalTypes);
  fastify.get("/animal-types/:id", getAnimalType);
  fastify.post("/animal-types", createAnimalType);
  fastify.put("/animal-types/:id", updateAnimalType);
  fastify.delete("/animal-types/:id", deleteAnimalType);
  fastify.get("/veterinarians", getAllVeterinarians);
  fastify.get("/veterinarians/:id", getVeterinarian);
  fastify.post("/veterinarians", createVeterinarian);
  fastify.put("/veterinarians/:id", updateVeterinarian);
  fastify.delete("/veterinarians/:id", deleteVeterinarian);
  fastify.get(
    "/support/chats",
    { preHandler: [fastify.authenticateAdmin] },
    getSupportChats
  );
  fastify.get(
    "/support/chats/:chatId/messages",
    { preHandler: [fastify.authenticateAdmin] },
    getChatMessages
  );
  fastify.patch(
    "/support/chats/:chatId/read",
    { preHandler: [fastify.authenticateAdmin] },
    markMessagesAsRead
  );
  fastify.patch(
    "/support/chats/:chatId/resolve",
    { preHandler: [fastify.authenticateAdmin] },
    resolveChat
  );
  fastify.post(
    "/support/chats/:chatId/messages",
    { preHandler: [fastify.authenticateAdmin] },
    sendAdminMessage
  );
}
