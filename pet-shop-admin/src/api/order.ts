import { api } from "./api";

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface OrderTransaction {
  paymentMethod: string;
  paymentStatus: string;
  amount: string;
  currency: string;
}

export interface OrderUser {
  id: string;
  fullName: string;
  email: string;
}

export interface AdminOrder {
  id: string;
  userId: string;
  status: string;
  totalAmount: string;
  deliveryStatus: string;
  deliveryAddress: string;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  user: OrderUser;
  items: OrderItem[];
  transaction?: OrderTransaction | null;
}

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  try {
    const response = await api.get<{ orders: AdminOrder[] }>("/admin/orders");
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    throw error;
  }
};

export const updateAdminOrderDeliveryStatus = async (
  orderId: string,
  deliveryStatus: "DELIVERED"
): Promise<AdminOrder> => {
  try {
    const response = await api.patch<{ order: AdminOrder; message: string }>(
      `/admin/orders/${orderId}/delivery-status`,
      { deliveryStatus }
    );
    return response.data.order;
  } catch (error) {
    console.error("Error updating order delivery status:", error);
    throw error;
  }
};

export const cancelAdminOrder = async (
  orderId: string,
  cancellationReason: string
): Promise<AdminOrder> => {
  try {
    const response = await api.patch<{ order: AdminOrder; message: string }>(
      `/admin/orders/${orderId}/cancel`,
      { cancellationReason }
    );
    return {
      ...response.data.order,
      totalAmount: String(response.data.order.totalAmount),
      items: response.data.order.items.map((item) => ({
        ...item,
        unitPrice: String(item.unitPrice),
        totalPrice: String(item.totalPrice),
      })),
      transaction: response.data.order.transaction
        ? {
            ...response.data.order.transaction,
            amount: String(response.data.order.transaction.amount),
          }
        : null,
    };
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};
