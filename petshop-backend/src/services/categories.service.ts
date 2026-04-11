import prisma from "../config/db";

export const getAllCategories = async () => {
  return await prisma.categories.findMany();
};

export const getCategoryById = async (id: string) => {
  return await prisma.categories.findUnique({ where: { id } });
};

export const createCategory = async (data: {
  name: string;
  description?: string;
  imageUrl?: string;
}) => {
  return await prisma.categories.create({ data });
};

export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string; imageUrl?: string }
) => {
  return await prisma.categories.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  return await prisma.categories.delete({ where: { id } });
};
