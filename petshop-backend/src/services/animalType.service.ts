import prisma from "../config/db";

export const getAllAnimalTypes = async () => {
  return await prisma.animalType.findMany();
};

export const getAnimalTypeById = async (id: string) => {
  return await prisma.animalType.findUnique({
    where: { id },
  });
};

export const createAnimalType = async (data: {
  name: string;
  description?: string;
  imageUrl?: string;
}) => {
  return await prisma.animalType.create({
    data,
  });
};

export const updateAnimalType = async (
  id: string,
  data: { name?: string; description?: string; imageUrl?: string }
) => {
  return await prisma.animalType.update({
    where: { id },
    data,
  });
};

export const deleteAnimalType = async (id: string) => {
  return await prisma.animalType.delete({ where: { id } });
};
