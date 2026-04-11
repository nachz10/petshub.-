import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../config/db";
import { findUserByEmail, findUserById } from "../services/auth.service";
import { comparePassword } from "../utils/jwt.utils";
import {
  sendOrderCancellationEmail,
  sendAppointmentCancellationEmail,
} from "../utils/email.utils";

export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await prisma.users.findMany();
    reply.send({ users });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching users" });
  }
};

export const getAllProducts = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const products = await prisma.products.findMany({
      include: { category: true, policies: true },
    });
    reply.send({ products });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching products" });
  }
};

export const adminLogin = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as any;

  const user = await findUserByEmail(email);
  if (!user || !user.isAdmin) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return reply.status(400).send({ message: "Invalid credentials" });
  }

  const payload = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    isAdmin: true,
  };

  const token = req.jwt.sign(payload);

  reply.setCookie("admin_access_token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });

  reply.send({ user });
};

export const verifyAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = req.user.id;
  const user = await findUserById(userId);

  if (user && user.isAdmin) {
    return reply.send({ user });
  }

  if (!user) {
    return reply.status(404).send({ message: "User not found" });
  }
};

export const getAllAppointments = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
        service: true,
        veterinarian: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    reply.send({ appointments });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching appointments" });
  }
};

export const updateAppointmentStatus = async (
  req: FastifyRequest<{
    // Define types for Params and Body
    Params: { id: string };
    Body: { status: string; cancellationReason?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const validStatuses = ["scheduled", "completed", "cancelled", "confirmed"];
    if (!validStatuses.includes(status)) {
      return reply.status(400).send({ message: "Invalid status" });
    }

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        pet: { include: { owner: true } },
        service: true,
        veterinarian: true,
      },
    });

    if (!existingAppointment) {
      return reply.status(404).send({ message: "Appointment not found" });
    }

    if (status === "cancelled") {
      if (!cancellationReason || cancellationReason.trim() === "") {
        return reply.status(400).send({
          message:
            "Cancellation reason is required for cancelling an appointment.",
        });
      }
      if (existingAppointment.status === "completed") {
        return reply
          .status(400)
          .send({ message: "Cannot cancel a completed appointment." });
      }
      if (existingAppointment.status === "cancelled") {
        return reply
          .status(400)
          .send({ message: "Appointment is already cancelled." });
      }
    }

    const dataToUpdate: any = { status };
    if (status === "cancelled" && cancellationReason) {
      dataToUpdate.cancellationReason = cancellationReason;
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: dataToUpdate,
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
        service: true,
        veterinarian: true,
      },
    });

    if (status === "cancelled" && appointment.pet.owner) {
      await sendAppointmentCancellationEmail(
        appointment.pet.owner.email,
        appointment.pet.owner.fullName || "Valued Client",
        {
          id: appointment.id,
          date: appointment.date,
          petName: appointment.pet.name,
          serviceName: appointment.service.name,
          vetName: appointment.veterinarian.fullName,
        },
        cancellationReason || "No reason provided"
      );
    }

    reply.send({ appointment });
  } catch (error: any) {
    console.error("Error updating appointment status:", error);
    if (error.code === "P2025") {
      return reply
        .status(404)
        .send({ message: "Appointment not found for update." });
    }
    reply.status(500).send({ message: "Error updating appointment status" });
  }
};

export const deleteAppointment = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = req.params as any;

    await prisma.appointment.delete({
      where: { id },
    });

    reply.send({ message: "Appointment deleted successfully" });
  } catch (error) {
    reply.status(500).send({ message: "Error deleting appointment" });
  }
};

export const getAllOrdersAdmin = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: {
          select: {
            productName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          },
        },
        transaction: {
          select: {
            paymentMethod: true,
            paymentStatus: true,
            amount: true,
            currency: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    reply.send({ orders });
  } catch (error) {
    console.error("Error fetching orders for admin:", error);
    reply.status(500).send({ message: "Error fetching orders" });
  }
};

export const updateOrderDeliveryStatus = async (
  req: FastifyRequest<{
    Params: { orderId: string };
    Body: { deliveryStatus: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    if (deliveryStatus !== "DELIVERED") {
      return reply.status(400).send({
        message:
          "Invalid delivery status. Only 'DELIVERED' is allowed through this endpoint.",
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    if (order.status !== "COMPLETED") {
      return reply.status(400).send({
        message: "Order payment is not completed. Cannot mark as delivered.",
      });
    }
    if (order.deliveryStatus === "DELIVERED") {
      return reply
        .status(400)
        .send({ message: "Order is already marked as delivered." });
    }
    if (
      order.deliveryStatus === "CANCELLED" ||
      order.deliveryStatus === "RETURNED"
    ) {
      return reply.status(400).send({
        message: `Order is ${order.deliveryStatus.toLowerCase()}. Cannot mark as delivered.`,
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryStatus: deliveryStatus,
      },
      include: {
        user: { select: { fullName: true, email: true } },
        items: {
          select: {
            productName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          },
        },
        transaction: {
          select: {
            paymentMethod: true,
            paymentStatus: true,
            amount: true,
            currency: true,
          },
        },
      },
    });

    reply.send({
      order: updatedOrder,
      message: "Order delivery status updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating order delivery status:", error);
    if (error.code === "P2025") {
      return reply.status(404).send({ message: "Order not found for update." });
    }
    reply.status(500).send({ message: "Error updating order delivery status" });
  }
};

export const cancelOrderAdmin = async (
  req: FastifyRequest<{
    Params: { orderId: string };
    Body: { cancellationReason: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { orderId } = req.params;
    const { cancellationReason } = req.body;

    if (!cancellationReason || cancellationReason.trim() === "") {
      return reply
        .status(400)
        .send({ message: "Cancellation reason is required." });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        items: {
          select: { productName: true, quantity: true, unitPrice: true },
        },
      },
    });

    if (!order) {
      return reply.status(404).send({ message: "Order not found." });
    }
    if (!order.user) {
      return reply
        .status(404)
        .send({ message: "User for this order not found." });
    }

    if (
      order.deliveryStatus === "DELIVERED" ||
      order.deliveryStatus === "RETURNED"
    ) {
      return reply.status(400).send({
        message: `Order is already ${order.deliveryStatus.toLowerCase()} and cannot be cancelled.`,
      });
    }
    if (order.deliveryStatus === "CANCELLED") {
      return reply.status(400).send({ message: "Order is already cancelled." });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        deliveryStatus: "CANCELLED",
        cancellationReason: cancellationReason,
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: {
          select: {
            productName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          },
        },
        transaction: {
          select: {
            paymentMethod: true,
            paymentStatus: true,
            amount: true,
            currency: true,
          },
        },
      },
    });
    await sendOrderCancellationEmail(
      order.user.email,
      order.user.fullName || "Valued Customer",
      {
        id: order.id,
        items: order.items.map((item) => ({
          ...item,
          unitPrice: item.unitPrice.toString(),
        })),
        totalAmount: order.totalAmount.toString(),
        deliveryAddress: order.deliveryAddress,
      },
      cancellationReason
    );

    reply.send({
      order: updatedOrder,
      message: "Order cancelled successfully and user notified.",
    });
  } catch (error: any) {
    console.error("Error cancelling order:", error);
    if (error.code === "P2025") {
      return reply
        .status(404)
        .send({ message: "Order not found for cancellation." });
    }
    reply.status(500).send({ message: "Failed to cancel order." });
  }
};
