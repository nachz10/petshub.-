import React, { useEffect, useState } from "react";
import StatsCard from "../components/home/StatsCard";
import SalesChart from "../components/home/SalesChart";
import TopProductsList from "../components/home/TopProductsList";
import OrderStatusPieChart from "../components/home/OrderStatusPieChart";
import LowStockProductsList from "../components/home/LowStockProductsList";

import {
  fetchDashboardSummary,
  fetchSalesOverTime,
  fetchTopSellingProducts,
  fetchOrderStatusDistribution,
  fetchLowStockProducts,
  DashboardSummary,
  SalesOverTimeData,
  TopSellingProduct,
  OrderStatusDistribution,
  LowStockProduct,
} from "../api/analytics";

const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [salesData, setSalesData] = useState<SalesOverTimeData[]>([]);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatusDistribution[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const [
          summaryData,
          salesOverTimeData,
          topProductsData,
          orderStatusData,
          lowStockData,
        ] = await Promise.all([
          fetchDashboardSummary(),
          fetchSalesOverTime(),
          fetchTopSellingProducts(),
          fetchOrderStatusDistribution(),
          fetchLowStockProducts(10, 5),
        ]);
        setSummary(summaryData);
        setSalesData(salesOverTimeData);
        setTopProducts(topProductsData);
        setOrderStatus(orderStatusData);
        setLowStock(lowStockData);
      } catch (error) {
        console.error("Failed to load analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  console.log(salesData);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Revenue"
            value={`$${Number(summary.totalRevenue).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
          <StatsCard
            title="Revenue This Month"
            value={`$${Number(summary.revenueThisMonth).toLocaleString(
              undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}`}
          />
          <StatsCard
            title="Total Orders"
            value={summary.totalOrders.toLocaleString()}
          />
          <StatsCard
            title="Total Customers"
            value={summary.totalUsers.toLocaleString()}
          />
          <StatsCard
            title="Total Products"
            value={summary.totalProducts.toLocaleString()}
          />
          <StatsCard
            title="New Customers (Last 30 Days)"
            value={summary.newUsersLast30Days.toLocaleString()}
          />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
        <SalesChart data={salesData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsList products={topProducts} />
        <OrderStatusPieChart data={orderStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockProductsList products={lowStock} />
      </div>
    </div>
  );
};

export default AdminDashboard;
