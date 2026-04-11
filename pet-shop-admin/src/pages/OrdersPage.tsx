import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import AdminOrdersTable from "../components/order/OrdersTable";
import ConfirmationDialog from "../components/DeleteConfirmationDialog";
import CancellationReasonDialog from "../components/order/CalcellationDialog";
import {
  getAdminOrders,
  updateAdminOrderDeliveryStatus,
  cancelAdminOrder,
  AdminOrder,
} from "../api/order";

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingOrderId, setActionLoadingOrderId] = useState<
    string | null
  >(null);

  const [confirmDeliverDialogOpen, setConfirmDeliverDialogOpen] =
    useState<boolean>(false);
  const [orderToUpdateDelivery, setOrderToUpdateDelivery] =
    useState<AdminOrder | null>(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [orderToCancel, setOrderToCancel] = useState<AdminOrder | null>(null);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to load orders.";
      setError(errorMessage);
      console.error("Error fetching orders:", err);
      setNotification({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleMarkAsDeliveredClick = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setOrderToUpdateDelivery(order);
      setConfirmDeliverDialogOpen(true);
    }
  };

  const handleConfirmUpdateDelivery = async () => {
    if (!orderToUpdateDelivery) return;

    setActionLoadingOrderId(orderToUpdateDelivery.id);
    setConfirmDeliverDialogOpen(false);
    try {
      const updatedOrder = await updateAdminOrderDeliveryStatus(
        orderToUpdateDelivery.id,
        "DELIVERED"
      );
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
      setNotification({
        open: true,
        message: `Order ${updatedOrder.id.substring(
          0,
          8
        )}... marked as delivered!`,
        severity: "success",
      });
    } catch (err: any) {
      console.error("Error marking order as delivered:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to mark order as delivered.";
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setActionLoadingOrderId(null);
      setOrderToUpdateDelivery(null);
    }
  };

  const handleDeliverDialogClose = () => {
    setConfirmDeliverDialogOpen(false);
    setOrderToUpdateDelivery(null);
  };

  const handleCancelOrderClick = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setOrderToCancel(order);
      setCancelDialogOpen(true);
    }
  };

  const handleConfirmCancelOrder = async (cancellationReason: string) => {
    if (!orderToCancel) return;

    setActionLoadingOrderId(orderToCancel.id);
    setCancelDialogOpen(false);
    try {
      const updatedOrder = await cancelAdminOrder(
        orderToCancel.id,
        cancellationReason
      );
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
      setNotification({
        open: true,
        message: `Order ${updatedOrder.id.substring(
          0,
          8
        )}... has been cancelled.`,
        severity: "success",
      });
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to cancel order.";
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setActionLoadingOrderId(null);
      setOrderToCancel(null);
    }
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setOrderToCancel(null);
  };

  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  if (loading && orders.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 200px)"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Orders
      </Typography>

      {error && !loading && orders.length === 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error} Please try refreshing the page. If the problem persists,
          contact support.
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 0, overflow: "hidden" }}>
        {" "}
        <AdminOrdersTable
          orders={orders}
          onMarkAsDelivered={handleMarkAsDeliveredClick}
          onCancelOrder={handleCancelOrderClick}
          isLoadingAction={actionLoadingOrderId}
        />
      </Paper>

      {orderToUpdateDelivery && (
        <ConfirmationDialog
          isForUpdate
          open={confirmDeliverDialogOpen}
          onClose={handleDeliverDialogClose}
          onConfirm={handleConfirmUpdateDelivery}
          title="Confirm Delivery Status Update"
          content={`Are you sure you want to mark order ID: ${orderToUpdateDelivery.id.substring(
            0,
            8
          )}... as DELIVERED?`}
        />
      )}

      {orderToCancel && (
        <CancellationReasonDialog
          open={cancelDialogOpen}
          onClose={handleCancelDialogClose}
          onConfirm={handleConfirmCancelOrder}
          title="Confirm Order Cancellation"
          contentText={`Please provide a reason for cancelling order ID: ${orderToCancel.id.substring(
            0,
            8
          )}... The customer will be notified.`}
          orderIdShort={orderToCancel.id.substring(0, 8)}
        />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOrdersPage;
