// support.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../config/db";

export const getSupportChats = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const chats = await prisma.supportChat.findMany({
      where: { isResolved: false },
      include: {
        user: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    reply.send(chats);
  } catch (error) {
    reply.status(500).send({ message: "Error fetching support chats" });
  }
};

export const getChatMessages = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { chatId } = req.params as any;
    const messages = await prisma.supportMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });
    reply.send(messages);
  } catch (error) {
    reply.status(500).send({ message: "Error fetching messages" });
  }
};

export const sendMessage = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = req.user.id;
    const { content } = req.body as any;

    // Find or create chat
    let chat = await prisma.supportChat.findFirst({
      where: { userId, isResolved: false },
    });

    if (!chat) {
      chat = await prisma.supportChat.create({
        data: { userId },
      });
    }

    // Create message
    const message = await prisma.supportMessage.create({
      data: {
        chatId: chat.id,
        senderId: userId,
        content,
      },
    });

    // Update chat timestamp
    await prisma.supportChat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    reply.send(message);
  } catch (error) {
    reply.status(500).send({ message: "Error sending message" });
  }
};

export const sendAdminMessage = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params as any;
    const { content } = req.body as any;

    const message = await prisma.supportMessage.create({
      data: {
        chatId,
        senderId: userId,
        content,
      },
    });

    // Update chat timestamp
    await prisma.supportChat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    reply.send(message);
  } catch (error) {
    reply.status(500).send({ message: "Error sending message" });
  }
};

export const markMessagesAsRead = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { chatId } = req.params as any;

    await prisma.supportMessage.updateMany({
      where: {
        chatId,
        senderId: { not: req.user.id },
      },
      data: { isRead: true },
    });

    reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ message: "Error marking messages as read" });
  }
};

export const resolveChat = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { chatId } = req.params as any;

    await prisma.supportChat.update({
      where: { id: chatId },
      data: { isResolved: true },
    });

    reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ message: "Error resolving chat" });
  }
};
