import prisma from "../config/db";

export const getAllProductTypes = async () => {
  return await prisma.productType.findMany({
    include: {
      attributes: true,
    },
  });
};

export const getProductTypeById = async (id: string) => {
  return await prisma.productType.findUnique({
    where: { id },
    include: {
      attributes: true,
    },
  });
};

export const createProductType = async (data: {
  name: string;
  description?: string;
}) => {
  return await prisma.productType.create({
    data,
  });
};

export const updateProductType = async (
  id: string,
  data: { name?: string; description?: string }
) => {
  return await prisma.productType.update({
    where: { id },
    data,
  });
};

export const deleteProductType = async (id: string) => {
  return await prisma.productType.delete({ where: { id } });
};
