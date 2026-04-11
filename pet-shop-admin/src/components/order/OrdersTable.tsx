import React from "react";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  CheckCircleOutline,
  InfoOutlined,
  CancelOutlined,
} from "@mui/icons-material";
import { Chip, Tooltip, Box, Typography } from "@mui/material";
import { AdminOrder, OrderItem } from "../../api/order";

interface AdminOrdersTableProps {
  orders: AdminOrder[];
  onMarkAsDelivered: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onViewDetails?: (order: AdminOrder) => void;
  isLoadingAction: string | null;
}

const getStatusChipColor = (
  status: string
): "success" | "warning" | "info" | "error" | "default" => {
  const upperStatus = status?.toUpperCase() || "";
  switch (upperStatus) {
    case "COMPLETED":
    case "DELIVERED":
      return "success";
    case "PENDING_PAYMENT":
    case "PENDING":
    case "PENDING_SHIPMENT":
      return "warning";
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return "info";
    case "CANCELLED":
    case "FAILED":
    case "PAYMENT_FAILED_OR_CANCELLED":
    case "PAYMENT_VERIFICATION_FAILED":
    case "PAYMENT_CALLBACK_ERROR":
    case "RETURNED":
      return "error";
    default:
      return "default";
  }
};

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
  orders,
  onMarkAsDelivered,
  onCancelOrder,
  onViewDetails,
  isLoadingAction,
}) => {
  console.log(orders);
  const columns: GridColDef<AdminOrder>[] = [
    {
      field: "id",
      headerName: "Order ID",
      width: 100,
      renderCell: (params: GridRenderCellParams<AdminOrder, string>) => (
        <Tooltip title={params.value || ""}>
          <Typography variant="body2" noWrap>
            {params.value?.substring(0, 8)}...
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "user",
      headerName: "Customer Email",
      width: 200,
      valueGetter: (params: any) => {
        return params.email;
      },
      renderCell: (params: GridRenderCellParams<AdminOrder, string>) => (
        <Tooltip title={params.value || ""}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total",
      width: 100,
      valueFormatter: (value: string) => {
        const amount = parseFloat(value as string);
        return `Rs.${amount.toFixed(0)}`;
      },
    },
    {
      field: "status",
      headerName: "Order Status",
      width: 140,
      renderCell: (params: GridRenderCellParams<AdminOrder, string>) => (
        <Chip
          label={params.value?.replace(/_/g, " ") || "N/A"}
          color={getStatusChipColor(params.value || "")}
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery",
      width: 160,
      renderCell: (params: GridRenderCellParams<AdminOrder, string>) => (
        <Chip
          label={params.value?.replace(/_/g, " ") || "N/A"}
          color={getStatusChipColor(params.value || "")}
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "items",
      headerName: "Items",
      width: 100,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<AdminOrder, OrderItem[]>) => (
        <Tooltip
          title={
            <Box sx={{ maxHeight: 200, overflowY: "auto", p: 1 }}>
              {params.row.items.map((item, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  display="block"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {item.productName} (x{item.quantity}) - Rs.
                  {parseFloat(item.unitPrice).toFixed(2)}
                </Typography>
              ))}
            </Box>
          }
        >
          <Typography variant="body2" noWrap>
            {params.row.items.length} item(s)
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      width: 130,
      type: "dateTime",
      valueGetter: (value) => new Date(value as string),
      valueFormatter: (value) => new Date(value as Date).toLocaleDateString(),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      getActions: (params) => {
        const order = params.row as AdminOrder;

        const canMarkAsDelivered =
          order.status === "COMPLETED" &&
          order.deliveryStatus !== "DELIVERED" &&
          order.deliveryStatus !== "CANCELLED" &&
          order.deliveryStatus !== "RETURNED";

        const canCancelOrder =
          order.deliveryStatus !== "DELIVERED" &&
          order.deliveryStatus !== "CANCELLED" &&
          order.deliveryStatus !== "RETURNED";

        const actions = [];

        if (canMarkAsDelivered) {
          actions.push(
            <GridActionsCellItem
              icon={
                <Tooltip title="Mark as Delivered">
                  <CheckCircleOutline />
                </Tooltip>
              }
              label="Mark as Delivered"
              onClick={() => onMarkAsDelivered(order.id)}
              disabled={isLoadingAction === order.id}
              key={`deliver-${order.id}`}
              color="success"
            />
          );
        }

        if (canCancelOrder) {
          actions.push(
            <GridActionsCellItem
              icon={
                <Tooltip title="Cancel Order">
                  <CancelOutlined />
                </Tooltip>
              }
              label="Cancel Order"
              onClick={() => onCancelOrder(order.id)}
              disabled={isLoadingAction === order.id}
              key={`cancel-${order.id}`}
              color="error"
            />
          );
        }

        if (onViewDetails) {
          actions.push(
            <GridActionsCellItem
              icon={
                <Tooltip title="View Details">
                  <InfoOutlined />
                </Tooltip>
              }
              label="View Details"
              onClick={() => onViewDetails(order)}
              key={`details-${order.id}`}
            />
          );
        }
        return actions;
      },
    },
  ];

  return (
    <Box sx={{ height: "calc(100vh - 280px)", width: "100%" }}>
      <DataGrid
        rows={orders}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
          sorting: {
            sortModel: [{ field: "createdAt", sort: "desc" }],
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        getRowId={(row) => row.id}
        density="compact"
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "grey.200",
          },
        }}
      />
    </Box>
  );
};

export default AdminOrdersTable;
