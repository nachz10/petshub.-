import prisma from "../config/db";

export const createProduct = async (productData: any) => {
  return prisma.products.create({
    data: productData,
  });
};

export const getProductById = async (productId: string, userId?: string) => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
    include: {
      category: true,
      policies: true,
      animalTargets: { include: { animalType: true } },
      productType: { include: { attributes: true } },
      images: { select: { id: true, url: true, isPrimary: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { fullName: true, id: true } } },
      },
    },
  });

  if (!product) {
    return null;
  }

  const totalReviews = product.reviews.length;
  let averageRating = 0;
  if (totalReviews > 0) {
    const sumOfRatings = product.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    averageRating = parseFloat((sumOfRatings / totalReviews).toFixed(1));
  }

  let canReview = false;
  if (userId) {
    const existingReview = await prisma.productReview.findUnique({
      where: {
        userId_productId: { userId: userId, productId: productId },
      },
    });

    if (!existingReview) {
      const eligibleOrder = await prisma.order.findFirst({
        where: {
          userId: userId,
          status: "COMPLETED",
          deliveryStatus: "DELIVERED",
          items: { some: { productId: productId } },
        },
      });
      if (eligibleOrder) {
        canReview = true;
      }
    }
  }

  return {
    ...product,
    price: Number(product.price),
    averageRating,
    totalReviews,
    canReview,
  };
};

export const getAllProducts = async () => {
  return prisma.products.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      productType: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          isPrimary: true,
        },
      },
      reviews: true,
      policies: true,
    },
  });
};

export const updateProduct = async (id: string, updateData: any) => {
  return prisma.products.update({
    where: { id },
    data: updateData,
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.products.delete({
    where: { id },
  });
};

export const getAllProductCategories = async () => {
  return prisma.categories.findMany();
};

export const getProductsByCategoryId = async (categoryId: string) => {
  return prisma.products.findMany({
    where: { categoryId },
    include: {
      category: true,
      policies: true,
      attributes: true,
      animalTargets: {
        include: {
          animalType: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          isPrimary: true,
        },
      },
      reviews: true,
      productType: {
        include: {
          attributes: true,
        },
      },
    },
  });
};

export const getFeaturedProducts = async () => {
  const products = await prisma.products.findMany({
    where: { isFeatured: true },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      productType: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          isPrimary: true,
        },
        orderBy: {
          isPrimary: "desc",
        },
      },
      policies: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  return products.map((product) => {
    const totalReviews = product.reviews.length;
    let averageRating = 0;
    if (totalReviews > 0) {
      const sumOfRatings = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      averageRating = parseFloat((sumOfRatings / totalReviews).toFixed(1));
    }
    const { reviews, ...productWithoutFullReviews } = product;
    return {
      ...productWithoutFullReviews,
      averageRating,
      totalReviews,
      price: Number(product.price),
    };
  });
};

export const getFeaturedCategories = async () => {
  return prisma.categories.findMany({
    where: { isFeatured: true },
  });
};

export const getShowInNavCategories = async () => {
  try {
    const categories = await prisma.categories.findMany({
      where: {
        showInNav: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching showInNav categories from service:", error);
    throw error;
  }
};
