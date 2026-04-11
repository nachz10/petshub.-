import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient, Products } from "@prisma/client";
import { generateEsewaSignature } from "../utils/esewaHelper";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const ESEWA_API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.ESEWA_PROD_URL!
    : process.env.ESEWA_UAT_URL!;
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY!;
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

interface InitiatePaymentRequestBody {
  items: CheckoutItemInput[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export async function initiatePayment(
  req: FastifyRequest<{ Body: InitiatePaymentRequestBody }>,
  res: FastifyReply
) {
  try {
    const userId = req.user.id;
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).send({ message: "No items to checkout." });
    }
    if (
      !deliveryAddress ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.phone
    ) {
      return res
        .status(400)
        .send({ message: "Delivery address is incomplete." });
    }

    let totalAmount = 0;
    const orderItemsData = [];
    const productUpdates = [];

    for (const item of items) {
      const product = await prisma.products.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        return res
          .status(404)
          .send({ message: `Product with ID ${item.productId} not found.` });
      }
      if (product.availableUnits < item.quantity) {
        return res.status(400).send({
          message: `Not enough stock for ${product.name}. Available: ${product.availableUnits}, Requested: ${item.quantity}`,
        });
      }
      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;
      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
      });
      productUpdates.push({
        id: product.id,
        newStock: product.availableUnits - item.quantity,
      });
    }
    const taxAmount = 0;
    const productServiceCharge = 0;
    const productDeliveryCharge = 0;
    const grandTotal =
      totalAmount + taxAmount + productServiceCharge + productDeliveryCharge;

    const orderId = uuidv4();

    await prisma.order.create({
      data: {
        id: orderId,
        userId,
        totalAmount: grandTotal,
        status: "PENDING_PAYMENT",
        deliveryStatus: "PENDING",
        deliveryAddress: `${deliveryAddress.fullName}, ${deliveryAddress.phone}\n${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zipCode}, ${deliveryAddress.country}`,
        items: {
          create: orderItemsData,
        },
        transaction: {
          create: {
            amount: grandTotal,
            paymentStatus: "PENDING",
            paymentMethod: "esewa",
            currency: "NPR",
          },
        },
      },
    });

    const successUrl = `${FRONTEND_URL}/payment-success`;
    const failureUrl = `${FRONTEND_URL}/payment-failure`;

    const formData = {
      amount: totalAmount.toFixed(2),
      tax_amount: taxAmount.toFixed(2),
      total_amount: grandTotal.toFixed(2),
      transaction_uuid: orderId,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: productServiceCharge.toFixed(2),
      product_delivery_charge: productDeliveryCharge.toFixed(2),
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
    console.log("\n signing start amount" + formData.total_amount);
    const signatureMessage = `total_amount=${formData.total_amount},transaction_uuid=${formData.transaction_uuid},product_code=${formData.product_code}`;
    console.log("\n message signature start \n" + signatureMessage);
    const signature = generateEsewaSignature(
      signatureMessage,
      ESEWA_SECRET_KEY
    );

    return res.send({
      esewa_url: ESEWA_API_URL,
      form_data: { ...formData, signature },
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res
      .status(500)
      .send({ message: "Server error during payment initiation." });
  }
}

export async function verifyEsewaPayment(
  req: FastifyRequest<{ Querystring: { data: string } }>,
  res: FastifyReply
) {
  try {
    const base64Data = req.query.data;
    if (!base64Data) {
      return res.status(400).send({ message: "No payment data received." });
    }

    const decodedDataString = Buffer.from(base64Data, "base64").toString(
      "utf-8"
    );
    const esewaResponse = JSON.parse(decodedDataString);

    const {
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code,
      signed_field_names,
      signature: receivedSignature,
    } = esewaResponse;

    // const messageToSign = signed_field_names
    //   .split(",")
    //   .map((field: any) => `${field}=${esewaResponse[field]}`)
    //   .join(",");

    // console.log("\n message signature New \n" + messageToSign);
    // console.log(
    //   "\n message signature New \n" + signed_field_names.total_amount
    // );

    // const expectedSignature = generateEsewaSignature(
    //   messageToSign,
    //   ESEWA_SECRET_KEY
    // );

    // if (expectedSignature !== receivedSignature) {
    //   console.error(
    //     "Signature mismatch. Expected:",
    //     expectedSignature,
    //     "Received:",
    //     receivedSignature
    //   );
    //   await prisma.order.update({
    //     where: { id: transaction_uuid },
    //     data: {
    //       status: "PAYMENT_VERIFICATION_FAILED",
    //       transaction: {
    //         update: {
    //           paymentStatus: "FAILED",
    //           responseData: decodedDataString,
    //         },
    //       },
    //     },
    //   });
    //   return res.status(400).send({
    //     success: false,
    //     message: "Payment verification failed: Signature mismatch.",
    //   });
    // }

    if (status !== "COMPLETE") {
      console.log(
        `Payment not complete. Status: ${status} for order ${transaction_uuid}`
      );
      await prisma.order.update({
        where: { id: transaction_uuid },
        data: {
          status: `PAYMENT_${status}`, // e.g., PAYMENT_PENDING, PAYMENT_CANCELED
          transaction: {
            update: {
              paymentStatus: status,
              responseData: decodedDataString,
              transactionId: transaction_code,
            },
          },
        },
      });
      return res.send({
        success: false,
        message: `Payment not completed. Status: ${status}`,
        orderId: transaction_uuid,
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: transaction_uuid },
      include: {
        items: true,
        user: { include: { Cart: { include: { items: true } } } },
      },
    });

    if (!order) {
      console.error(
        `Order ${transaction_uuid} not found after successful eSewa callback.`
      );
      return res
        .status(404)
        .send({ success: false, message: "Order not found." });
    }

    if (order.status === "COMPLETED") {
      console.log(`Order ${transaction_uuid} already processed.`);
      return res.send({
        success: true,
        message: "Payment successful. Order already processed.",
        orderId: transaction_uuid,
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: transaction_uuid },
        data: {
          status: "COMPLETED",
          deliveryStatus: "PENDING_SHIPMENT",
          transaction: {
            update: {
              paymentStatus: "COMPLETE",
              transactionId: transaction_code,
              paymentDate: new Date(),
              responseData: decodedDataString,
            },
          },
        },
      });

      for (const orderItem of order.items) {
        await tx.products.update({
          where: { id: orderItem.productId },
          data: {
            availableUnits: {
              decrement: orderItem.quantity,
            },
          },
        });
      }
      const userCart = order.user?.Cart?.[0];
      if (userCart) {
        await tx.cartItems.deleteMany({ where: { cartId: userCart.id } });
      }
    });

    return res.send({
      success: true,
      message: "Payment successful and order processed.",
      orderId: transaction_uuid,
    });
  } catch (error) {
    console.error("Error verifying eSewa payment:", error);
    const base64Data = req.query.data;
    if (base64Data) {
      try {
        const decodedDataString = Buffer.from(base64Data, "base64").toString(
          "utf-8"
        );
        const esewaResponse = JSON.parse(decodedDataString);
        if (esewaResponse.transaction_uuid) {
          await prisma.order
            .update({
              where: { id: esewaResponse.transaction_uuid },
              data: {
                status: "PAYMENT_CALLBACK_ERROR",
                transaction: {
                  update: {
                    paymentStatus: "ERROR",
                    responseData: decodedDataString,
                  },
                },
              },
            })
            .catch((e) =>
              console.error(
                "Failed to update order status on callback error:",
                e
              )
            );
        }
      } catch (parseError) {
        console.error(
          "Error parsing eSewa data during error handling:",
          parseError
        );
      }
    }
    return res.status(500).send({
      success: false,
      message: "Server error during payment verification.",
    });
  }
}

export async function handleEsewaFailure(
  req: FastifyRequest<{
    Querystring: { oid?: string; amt?: string; refId?: string };
  }>,
  res: FastifyReply
) {
  const orderId = req.query.oid;
  console.log("eSewa Payment Failed/Cancelled. Query:", req.query);

  if (orderId) {
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAYMENT_FAILED_OR_CANCELLED",
          transaction: {
            update: {
              paymentStatus: "FAILED_OR_CANCELLED",
            },
          },
        },
      });
    } catch (error) {
      console.error(
        `Error updating order ${orderId} status to FAILED/CANCELLED:`,
        error
      );
    }
  }
  res.redirect(`${FRONTEND_URL}/payment-failure?orderId=${orderId || ""}`);
}
