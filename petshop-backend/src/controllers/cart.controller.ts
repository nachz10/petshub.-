import {
  getCart,
  addItemToCart,
  removeCartItem,
  updateCartItem,
  clearCart,
} from "../services/cart.service";
import { FastifyRequest, FastifyReply } from "fastify";

// Get user's cart
export async function getUserCart(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const cart = await getCart(userId);
    return res.status(200).send(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).send({ message: "Server error" });
  }
}

// Add item to cart
export async function addItem(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body as {
      productId: string;
      quantity: number;
    };

    if (!productId || !quantity) {
      return res
        .status(400)
        .send({ message: "Product ID and quantity are required" });
    }

    const cart = await addItemToCart(userId, productId, quantity);
    return res.status(200).send({ message: "Item added to cart", cart });
  } catch (error: any) {
    console.error("Error adding item to cart:", error);

    if (
      error.message === "Product not found" ||
      error.message === "Not enough units available in stock"
    ) {
      return res.status(400).send({ message: error.message });
    }

    return res.status(500).send({ message: "Server error" });
  }
}

// Update item quantity
export async function updateItem(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const { id } = req.params as { id: string };
    const { quantity } = req.body as { quantity: number };

    if (!quantity) {
      return res.status(400).send({ message: "Quantity is required" });
    }

    const cart = await updateCartItem(userId, id, quantity);
    return res.status(200).send({ message: "Cart updated", cart });
  } catch (error: any) {
    console.error("Error updating cart:", error);

    if (
      error.message === "Quantity must be greater than 0" ||
      error.message === "Product not found" ||
      error.message === "Cart not found" ||
      error.message === "Item not found in cart" ||
      error.message === "Not enough units available in stock"
    ) {
      return res.status(400).send({ message: error.message });
    }

    return res.status(500).send({ message: "Server error" });
  }
}

// Remove item from cart
export async function removeItem(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const { id } = req.params as { id: string };

    const cart = await removeCartItem(userId, id);
    return res.status(200).send({ message: "Item removed from cart", cart });
  } catch (error: any) {
    console.error("Error removing item from cart:", error);

    if (error.message === "Cart not found") {
      return res.status(404).send({ message: error.message });
    }

    return res.status(500).send({ message: "Server error" });
  }
}

// Clear cart
export async function clearallItem(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const result = await clearCart(userId);
    return res.status(200).send(result);
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).send({ message: "Server error" });
  }
}
