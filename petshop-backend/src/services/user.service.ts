import prisma from "../config/db";
import { hashPassword } from "../utils/jwt.utils";

export const createUser = async (userData: {
  email: string;
  fullName: string;
  password: string;
}) => {
  const hashedPassword = await hashPassword(userData.password);

  return prisma.users.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
};

export const getUserById = async (id: string) => {
  return prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      createdAt: true,
      updatedAt: true,
      addresses: {
        select: {
          id: true,
          street: true,
          city: true,
          state: true,
          zipCode: true,
          country: true,
          isDefault: true,
        },
      },
    },
  });
};

export const getAllUsers = async () => {
  return prisma.users.findMany({
    where: {
      isAdmin: false,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUser = async (
  id: string,
  updateData: {
    email?: string;
    fullName?: string;
    password?: string;
  }
) => {
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }

  return prisma.users.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      fullName: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (id: string) => {
  return prisma.users.delete({
    where: { id },
  });
};

export const getUserByEmail = async (email: string) => {
  return prisma.users.findUnique({
    where: { email },
  });
};

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      transaction: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: {
      isDefault: "desc",
    },
  });
}
