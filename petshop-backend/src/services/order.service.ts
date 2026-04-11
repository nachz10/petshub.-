import prisma from "../config/db";
import { Decimal } from "@prisma/client/runtime/library";

export async function createOrderFromCart(
  userId: string,
  deliveryAddress: string
) {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum.plus(new Decimal(item.price).times(item.quantity)),
      new Decimal(0)
    );

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: totalAmount.toFixed(2),
        deliveryAddress,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: new Decimal(item.price).times(item.quantity).toFixed(2),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        orderId: order.id,
        amount: totalAmount.toFixed(2),
      },
    });

    await prisma.cartItems.deleteMany({
      where: { cartId: cart.id },
    });

    return { order, transaction };
  } catch (error) {
    console.error("Error creating order from cart:", error);
    throw error;
  }
}

export async function createOrderFromProduct(
  userId: string,
  productId: string,
  quantity: number,
  deliveryAddress: string
) {
  try {
    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.availableUnits < quantity) {
      throw new Error("Not enough units available in stock");
    }

    const totalPrice = new Decimal(product.price).times(quantity);

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: totalPrice.toFixed(2),
        deliveryAddress,
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              quantity,
              unitPrice: product.price,
              totalPrice: totalPrice.toFixed(2),
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        orderId: order.id,
        amount: totalPrice.toFixed(2),
      },
    });

    return { order, transaction };
  } catch (error) {
    console.error("Error creating order from product:", error);
    throw error;
  }
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        transaction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
}

export async function getOrderById(orderId: string, userId?: string) {
  try {
    const whereClause: any = { id: orderId };

    if (userId) {
      whereClause.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        items: true,
        transaction: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function updateDeliveryStatus(
  orderId: string,
  deliveryStatus: string
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { deliveryStatus },
    });

    return order;
  } catch (error) {
    console.error("Error updating delivery status:", error);
    throw error;
  }
}
