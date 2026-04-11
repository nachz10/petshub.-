import React from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category: { id: string; name: string };
  imageUrl: string;
};

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      valueFormatter: (params: any) => {
        return `$${params as string}`;
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      valueFormatter: (params: any) => params.name as string,
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
          onClick={() => onEdit(params.row as Product)}
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
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default ProductTable;
