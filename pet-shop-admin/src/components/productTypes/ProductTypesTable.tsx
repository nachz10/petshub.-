import React from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";

export type ProductType = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  attributes?: ProductTypeAttribute[];
};

interface ProductTypeTableProps {
  productTypes: ProductType[];
  onEdit: (productType: ProductType) => void;
  onDelete: (productTypeId: string) => void;
}

const ProductTypeTable: React.FC<ProductTypeTableProps> = ({
  productTypes,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      valueFormatter: (params) => params || "-",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 150,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
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
          onClick={() => onEdit(params.row as ProductType)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => onDelete(params.row.id as string)}
        />,
      ],
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={productTypes}
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

export default ProductTypeTable;
