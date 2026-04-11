import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { base_api_url } from "../pages/product/ProductDetail";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type CartState = {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  error: string | null;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
      addToCart: (product: any, quantity: number) => Promise<void>;
      removeFromCart: (id: string) => Promise<void>;
      updateQuantity: (id: string, quantity: number) => Promise<void>;
      clearCart: () => Promise<void>;
    }
  | undefined
>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems, itemCount: state.itemCount };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          itemCount: state.itemCount + 1,
        };
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        itemCount: state.itemCount - 1,
      };
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
        itemCount: state.itemCount,
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [], itemCount: 0 };
    case "SET_CART":
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        itemCount: action.payload.length,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    itemCount: 0,
    isLoading: true,
    error: null,
  });

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      if (isAuthenticated) {
        try {
          const response = await axios.get("http://localhost:3000/api/cart", {
            withCredentials: true,
          });

          if (response.status === 200) {
            dispatch({ type: "SET_CART", payload: response.data.items });
          }
        } catch (error) {
          console.error("Failed to load cart from server:", error);
          dispatch({
            type: "SET_ERROR",
            payload: "Failed to load your cart. Please try again.",
          });
          const localCart = localStorage.getItem("cart");
          if (localCart) {
            dispatch({ type: "SET_CART", payload: JSON.parse(localCart) });
          }
        }
      } else {
        const localCart = localStorage.getItem("cart");
        if (localCart) {
          dispatch({ type: "SET_CART", payload: JSON.parse(localCart) });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadCart();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }, [state.items, state.isLoading]);

  const addToCart = async (product: any, quantity: number) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: `${base_api_url}${product.images[0].url}`,
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });

    if (isAuthenticated) {
      try {
        await axios.post(
          "http://localhost:3000/api/cart/add",
          { productId: product.id, quantity },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Failed to sync cart with server:", error);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });

    if (isAuthenticated) {
      try {
        await axios.delete(`http://localhost:3000/api/cart/item/${id}`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Failed to remove item from server cart:", error);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });

    if (isAuthenticated) {
      try {
        await axios.put(
          `http://localhost:3000/api/cart/item/${id}`,
          { quantity },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Failed to update item quantity on server:", error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    if (isAuthenticated) {
      try {
        await axios.delete("http://localhost:3000/api/cart", {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Failed to clear server cart:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
