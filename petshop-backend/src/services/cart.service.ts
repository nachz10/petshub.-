import prisma from "../config/db";

export async function getCart(userId: string) {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
          },
        },
      },
    });

    if (!cart) {
      return { items: [] };
    }
    const items = cart.items.map((item: any) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: "http://localhost:3000" + item.product.images[0].url,
    }));

    return { items };
  } catch (error) {
    throw error;
  }
}

export async function addItemToCart(
  userId: string,
  productId: any,
  quantity: number
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

    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    const existingItem = await prisma.cartItems.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      await prisma.cartItems.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      await prisma.cartItems.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
        },
      });
    }

    return await getCart(userId);
  } catch (error) {
    throw error;
  }
}

export async function updateCartItem(
  userId: string,
  productId: any,
  quantity: number
) {
  try {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItem = await prisma.cartItems.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.availableUnits < quantity) {
      throw new Error("Not enough units available in stock");
    }

    await prisma.cartItems.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    return await getCart(userId);
  } catch (error) {
    throw error;
  }
}

export async function removeCartItem(userId: string, productId: any) {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    await prisma.cartItems.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    return await getCart(userId);
  } catch (error) {
    throw error;
  }
}

export async function clearCart(userId: any) {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItems.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return { message: "Cart cleared" };
  } catch (error) {
    throw error;
  }
}
