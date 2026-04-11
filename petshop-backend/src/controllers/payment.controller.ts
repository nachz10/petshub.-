import { FastifyRequest, FastifyReply } from "fastify";
import {
  processEsewaSuccess,
  processEsewaFailure,
} from "../services/transaction.service";

export async function handleEsewaSuccess(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const { pid, refId, amt, txnId } = req.query as {
      pid: string; // Order ID
      refId: string; // eSewa Reference ID
      amt: string; // Amount
      txnId: string; // eSewa Transaction ID
    };

    if (!pid || !refId) {
      return res.status(400).send({ message: "Missing required parameters" });
    }

    const result = await processEsewaSuccess(pid, refId, txnId);

    return res.status(200).send({
      message: "Payment successful",
      transaction: result.transaction,
      order: result.order,
    });
  } catch (error: any) {
    console.error("Error processing eSewa success:", error);
    return res.status(500).send({ message: "Error processing payment" });
  }
}

export async function handleEsewaFailure(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const { pid, reason } = req.query as {
      pid: string; // Order ID
      reason?: string; // Failure reason
    };

    if (!pid) {
      return res.status(400).send({ message: "Order ID is required" });
    }

    const result = await processEsewaFailure(pid, reason || "Unknown reason");

    return res.status(200).send({
      message: "Payment failed",
      transaction: result.transaction,
      order: result.order,
    });
  } catch (error) {
    console.error("Error processing eSewa failure:", error);
    return res.status(500).send({ message: "Server error" });
  }
}
