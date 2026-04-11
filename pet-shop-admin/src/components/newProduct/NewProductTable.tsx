import React from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { Product } from "../../api/newProduct";
import { Box, Chip } from "@mui/material";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  const API_BASE_URL = "http://localhost:3000";

  const columns: GridColDef<Product>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "images",
      headerName: "Image",
      width: 80,
      renderCell: (params) => {
        const primaryImage =
          params.row.images.find((img) => img.isPrimary) ||
          params.row.images[0];
        const imageUrl = primaryImage?.url;
        return imageUrl ? (
          <img
            src={
              imageUrl.startsWith("http")
                ? imageUrl
                : `${API_BASE_URL}${imageUrl}`
            }
            alt={params.row.name}
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : (
          "-"
        );
      },
    },
    { field: "name", headerName: "Name", flex: 2, minWidth: 150 },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 100,
      valueGetter: (params: any) => {
        return params?.name || "-";
      },
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 90,
      valueFormatter: (params) => `₹${params}`,
    },
    { field: "availableUnits", headerName: "Stock", type: "number", width: 80 },
    {
      field: "isFeatured",
      headerName: "Featured",
      type: "boolean",
      width: 90,
      renderCell: (params) =>
        params.value ? (
          <Chip label="Yes" size="small" color="success" />
        ) : (
          <Chip label="No" size="small" />
        ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => onEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => onDelete(params.row.id)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
      {" "}
      {/* Adjust height as needed */}
      <DataGrid
        rows={products}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
        autoHeight={false} // Set to false for fixed height container
      />
    </Box>
  );
};

export default ProductsTable;
