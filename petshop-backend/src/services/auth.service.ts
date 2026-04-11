import prisma from "../config/db";

export const createUser = async (userData: any) => {
  return prisma.users.create({
    data: userData,
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.users.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string) => {
  return prisma.users.findUnique({
    where: { id },
  });
};
