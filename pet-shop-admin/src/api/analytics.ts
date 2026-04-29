import { api } from "./api";

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;  
  totalUsers: number;
  totalProducts: number;
  newUsersLast30Days: number;
  revenueThisMonth: number;
}

export interface SalesOverTimeData {
  month: string;
  sales: number;
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalRevenueGenerated: number;
  imageUrl?: string;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  availableUnits: number;
  imageUrl?: string;
}

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/admin/analytics/summary", {
    withCredentials: true,
  });
  return response.data;
};

export const fetchSalesOverTime = async (): Promise<SalesOverTimeData[]> => {
  const response = await api.get<SalesOverTimeData[]>(
    "/admin/analytics/sales-over-time",
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchTopSellingProducts = async (
  limit: number = 5
): Promise<TopSellingProduct[]> => {
  const response = await api.get<TopSellingProduct[]>(
    `/admin/analytics/top-selling-products?limit=${limit}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchOrderStatusDistribution = async (): Promise<
  OrderStatusDistribution[]
> => {
  const response = await api.get<OrderStatusDistribution[]>(
    "/admin/analytics/order-status-distribution",
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchLowStockProducts = async (
  threshold: number = 10,
  limit: number = 5
): Promise<LowStockProduct[]> => {
  const response = await api.get<LowStockProduct[]>(
    `/admin/analytics/low-stock-products?threshold=${threshold}&limit=${limit}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};
