import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../config/db";

const getDateRange = (period: string, count: number) => {
  const endDate = new Date();
  let startDate = new Date();

  switch (period) {
    case "daily":
      startDate.setDate(endDate.getDate() - count);
      break;
    case "weekly":
      startDate.setDate(endDate.getDate() - count * 7);
      break;
    case "monthly":
      startDate.setMonth(endDate.getMonth() - count);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }
  return { startDate, endDate };
};

export const getDashboardSummary = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const totalRevenueResult = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "complete" },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    const totalOrders = await prisma.order.count();
    const totalUsers = await prisma.users.count({ where: { isAdmin: false } });
    const totalProducts = await prisma.products.count();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = await prisma.users.count({
      where: { createdAt: { gte: thirtyDaysAgo }, isAdmin: false },
    });

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const revenueThisMonthResult = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        paymentStatus: "complete",
        createdAt: { gte: startOfMonth },
      },
    });
    const revenueThisMonth = revenueThisMonthResult._sum.amount || 0;

    reply.send({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      newUsersLast30Days,
      revenueThisMonth,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    reply.status(500).send({ message: "Error fetching dashboard summary" });
  }
};

export const getSalesOverTime = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const salesData = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const targetMonth = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );
      const nextMonth = new Date(
        today.getFullYear(),
        today.getMonth() - i + 1,
        1
      );

      const monthName = targetMonth.toLocaleString("default", {
        month: "short",
      });
      const year = targetMonth.getFullYear();

      const monthlySales = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          paymentStatus: "complete",
          createdAt: {
            gte: targetMonth,
            lt: nextMonth,
          },
        },
      });
      salesData.push({
        month: `${monthName} ${year}`,
        sales: monthlySales._sum.amount || 0,
      });
    }
    reply.send(salesData);
  } catch (error) {
    console.error("Error fetching sales over time:", error);
    reply.status(500).send({ message: "Error fetching sales over time" });
  }
};

export const getTopSellingProducts = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { limit = 5 } = req.query as { limit?: number };
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: {
        _sum: { totalPrice: "desc" },
      },
      take: Number(limit),
    });
    const productsWithDetails = await Promise.all(
      topProducts.map(async (p) => {
        const product = await prisma.products.findUnique({
          where: { id: p.productId },
          select: { images: { where: { isPrimary: true }, take: 1 } },
        });
        return {
          ...p,
          productName: p.productName,
          totalQuantitySold: p._sum.quantity,
          totalRevenueGenerated: p._sum.totalPrice,
          imageUrl: product?.images[0]?.url,
        };
      })
    );

    reply.send(productsWithDetails);
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    reply.status(500).send({ message: "Error fetching top selling products" });
  }
};

export const getOrderStatusDistribution = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const distribution = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });
    reply.send(
      distribution.map((d) => ({ status: d.status, count: d._count.status }))
    );
  } catch (error) {
    console.error("Error fetching order status distribution:", error);
    reply
      .status(500)
      .send({ message: "Error fetching order status distribution" });
  }
};

export const getLowStockProducts = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { threshold = 10, limit = 5 } = req.query as {
    threshold?: number;
    limit?: number;
  };
  try {
    const lowStock = await prisma.products.findMany({
      where: {
        availableUnits: {
          lt: Number(threshold),
        },
      },
      orderBy: {
        availableUnits: "asc",
      },
      take: Number(limit),
      select: {
        id: true,
        name: true,
        availableUnits: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });
    reply.send(lowStock.map((p) => ({ ...p, imageUrl: p.images[0]?.url })));
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    reply.status(500).send({ message: "Error fetching low stock products" });
  }
};
