import prisma from "../config/db";

export async function processEsewaSuccess(
  orderId: string,
  refId: string,
  transactionCode: string
) {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { orderId },
      include: { order: true },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }
    const isValid = await verifyEsewaPayment(
      refId,
      transaction.amount.toNumber()
    );

    if (!isValid) {
      throw new Error("Payment verification failed");
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentStatus: "completed",
        transactionId: transactionCode,
        referenceId: refId,
        paymentDate: new Date(),
        responseData: JSON.stringify({
          refId,
          transactionCode,
          status: "success",
        }),
      },
    });

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "processing" },
    });

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
    });

    for (const item of orderItems) {
      await prisma.products.update({
        where: { id: item.productId },
        data: {
          availableUnits: {
            decrement: item.quantity,
          },
        },
      });
    }

    return { transaction: updatedTransaction, order: updatedOrder };
  } catch (error) {
    console.error("Error processing eSewa success:", error);
    throw error;
  }
}

export async function processEsewaFailure(orderId: string, reason: string) {
  try {
    const transaction = await prisma.transaction.update({
      where: { orderId },
      data: {
        paymentStatus: "failed",
        responseData: JSON.stringify({
          status: "failed",
          reason,
        }),
      },
    });

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    });

    return { transaction, order };
  } catch (error) {
    console.error("Error processing eSewa failure:", error);
    throw error;
  }
}

async function verifyEsewaPayment(
  refId: string,
  amount: number
): Promise<boolean> {
  try {
    return true;
  } catch (error) {
    console.error("Error verifying eSewa payment:", error);
    return false;
  }
}
