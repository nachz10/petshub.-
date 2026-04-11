import { FastifyRequest, FastifyReply } from "fastify";
import {
  createOrderFromCart,
  createOrderFromProduct,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateDeliveryStatus,
} from "../services/order.service";

export async function createCartOrder(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const { deliveryAddress } = req.body as { deliveryAddress: string };

    if (!deliveryAddress) {
      return res.status(400).send({ message: "Delivery address is required" });
    }

    const result = await createOrderFromCart(userId, deliveryAddress);

    return res.status(200).send({
      message: "Order created successfully",
      order: result.order,
      transaction: result.transaction,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);

    if (error.message === "Cart is empty") {
      return res.status(400).send({ message: error.message });
    }

    return res.status(500).send({ message: "Server error" });
  }
}

export async function createProductOrder(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const userId = req.user.id;
    const { productId, quantity, deliveryAddress } = req.body as {
      productId: string;
      quantity: number;
      deliveryAddress: string;
    };

    if (!productId || !quantity || !deliveryAddress) {
      return res.status(400).send({
        message: "Product ID, quantity, and delivery address are required",
      });
    }

    const result = await createOrderFromProduct(
      userId,
      productId,
      quantity,
      deliveryAddress
    );

    return res.status(200).send({
      message: "Order created successfully",
      order: result.order,
      transaction: result.transaction,
    });
  } catch (error: any) {
    console.error("Error creating product order:", error);

    if (
      error.message === "Product not found" ||
      error.message === "Not enough units available in stock"
    ) {
      return res.status(400).send({ message: error.message });
    }

    return res.status(500).send({ message: "Server error" });
  }
}

export async function getOrders(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const orders = await getUserOrders(userId);

    return res.status(200).send({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).send({ message: "Server error" });
  }
}

export async function getOrder(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const { id } = req.params as { id: string };

    const order = await getOrderById(id, userId);

    return res.status(200).send({ order });
  } catch (error: any) {
    console.error("Error fetching order:", error);

    if (error.message === "Order not found") {
      return res.status(404).send({ message: error.message });
    }

    return res.status(500).send({ message: "Server error" });
  }
}
