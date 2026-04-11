import prisma from "../config/db";

export const getAllVeterinarians = async () => {
  return await prisma.veterinarian.findMany({
    include: {
      schedules: true,
    },
  });
};

export const getVeterinarianById = async (id: string) => {
  return await prisma.veterinarian.findUnique({
    where: { id },
    include: {
      schedules: true,
    },
  });
};

export const createVeterinarian = async (data: {
  fullName: string;
  speciality?: string;
  bio?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}) => {
  return await prisma.veterinarian.create({
    data,
  });
};

export const updateVeterinarian = async (
  id: string,
  data: {
    fullName?: string;
    speciality?: string;
    bio?: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }
) => {
  return await prisma.veterinarian.update({
    where: { id },
    data,
  });
};

export const deleteVeterinarian = async (id: string) => {
  return await prisma.veterinarian.delete({ where: { id } });
};
