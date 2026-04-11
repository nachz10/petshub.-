import React from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";

export type Category = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
};

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
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
      field: "imageUrl",
      headerName: "Image",
      width: 150,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="Category"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : (
          "-"
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
          onClick={() => onEdit(params.row as Category)}
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
        rows={categories}
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

export default CategoryTable;
