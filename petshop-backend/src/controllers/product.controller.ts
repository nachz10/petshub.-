import { FastifyRequest, FastifyReply } from "fastify";
import {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAllProductCategories,
  getProductsByCategoryId,
  getFeaturedCategories,
  getFeaturedProducts,
  getShowInNavCategories,
} from "../services/product.service";
import prisma from "../config/db";

export const getFeaturedProductsHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const featuredProducts = await getFeaturedProducts();
    reply.send({ featuredProducts });
  } catch (error) {
    reply.status(500).send({
      message: "Error fetching featured products",
      error,
    });
  }
};

export const getFeaturedCategoriesHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const featuredCategories = await getFeaturedCategories();
    reply.send({ featuredCategories });
  } catch (error) {
    reply.status(500).send({
      message: "Error fetching featured categories",
      error,
    });
  }
};

export const addProduct = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const product = await createProduct(req.body);
    reply.status(201).send({ product });
  } catch (error) {
    reply.status(400).send({ message: "Error creating product", error });
  }
};

export const getProduct = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  try {
    const productWithDetails = await getProductById(id, req.user?.id);
    if (!productWithDetails)
      return reply.status(404).send({ message: "Product not found" });
    reply.send({ product: productWithDetails });
  } catch (error) {
    console.error("Error fetching product details:", error);
    reply.status(400).send({ message: "Error getting product details", error });
  }
};

export const getAllProductsHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const products = await getAllProducts();
  reply.send({ products });
};

export const editProduct = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  try {
    const updatedProduct = await updateProduct(id, req.body);
    reply.send({ updatedProduct });
  } catch (error) {
    reply.status(400).send({ message: "Error updating product", error });
  }
};

export const removeProduct = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: string };
  try {
    await deleteProduct(id);
    reply.send({ message: "Product deleted successfully" });
  } catch (error) {
    reply.status(400).send({ message: "Error deleting product", error });
  }
};

export const getAllCategoriesHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const categories = await getAllProductCategories();
    reply.send({ categories });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching categories", error });
  }
};

export const getProductsByCategory = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { categoryId } = req.params as { categoryId: string };
  try {
    const products = await getProductsByCategoryId(categoryId);
    if (!products.length) {
      return reply
        .status(404)
        .send({ message: "No products found for this category" });
    }
    reply.send({ products });
  } catch (error) {
    reply
      .status(500)
      .send({ message: "Error fetching products by category", error });
  }
};

interface SearchQueryParams {
  query?: string;
}

export const searchProducts = async (
  req: FastifyRequest<{ Querystring: SearchQueryParams }>,
  reply: FastifyReply
) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      const products = await getAllProducts();
      return reply.send({ products });
    }

    const searchTerm = query.trim();

    const rawProducts = await prisma.products.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { category: { name: { contains: searchTerm } } },
          { description: { contains: searchTerm } },
        ],
      },
      include: {
        category: true,
        policies: true,
        attributes: true,
        images: {
          select: {
            id: true,
            url: true,
            isPrimary: true,
          },
        },
        reviews: true,
        animalTargets: {
          include: {
            animalType: true,
          },
        },
        productType: {
          include: {
            attributes: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const productsWithAggregatedData = rawProducts.map((product) => {
      const totalReviews = product.reviews.length;
      let averageRating = 0;

      if (totalReviews > 0) {
        const sumOfRatings = product.reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        averageRating = parseFloat((sumOfRatings / totalReviews).toFixed(1));
      }

      return {
        ...product,
        averageRating,
        totalReviews,
        price: Number(product.price),
      };
    });

    reply.send({ products: productsWithAggregatedData });
  } catch (error) {
    console.error("Error searching products:", error);
    reply.status(500).send({ error: "Failed to search products" });
  }
};

interface CreateReviewBody {
  rating: number;
  comment?: string;
}

export const createProductReview = async (
  req: FastifyRequest<{
    Params: { productId: string };
    Body: CreateReviewBody;
  }>,
  reply: FastifyReply
) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!userId) {
      return reply
        .status(401)
        .send({ message: "Unauthorized. Please login to review." });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return reply
        .status(400)
        .send({ message: "Rating must be a number between 1 and 5." });
    }
    if (comment && typeof comment !== "string") {
      return reply.status(400).send({ message: "Comment must be a string." });
    }

    const productExists = await prisma.products.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      return reply.status(404).send({ message: "Product not found." });
    }

    const eligibleOrder = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: "COMPLETED",
        deliveryStatus: "DELIVERED",
        items: {
          some: {
            productId: productId,
          },
        },
      },
    });

    if (!eligibleOrder) {
      return reply.status(403).send({
        message:
          "You can only review products you have purchased and that have been delivered.",
      });
    }
    const newReview = await prisma.productReview.create({
      data: {
        rating,
        comment: comment || null,
        productId,
        userId,
      },
      include: {
        user: {
          select: { fullName: true },
        },
      },
    });

    return reply
      .status(201)
      .send({ review: newReview, message: "Review submitted successfully." });
  } catch (error: any) {
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("userId") &&
      error.meta?.target?.includes("productId")
    ) {
      return reply.status(409).send({
        message: "You have already submitted a review for this product.",
      });
    }
    console.error("Error creating product review:", error);
    return reply
      .status(500)
      .send({ message: "Failed to submit review. Please try again." });
  }
};

export const getShowInNavCategoriesHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const categories = await getShowInNavCategories();
    reply.send({ categories });
  } catch (error) {
    console.error("Error in getShowInNavCategoriesHandler:", error);
    reply.status(500).send({
      message: "Error fetching categories for navigation",
      error,
    });
  }
};
