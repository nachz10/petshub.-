import React from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";

export type Veterinarian = {
  id: string;
  fullName: string;
  speciality: string | null;
  bio: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

interface VeterinarianTableProps {
  veterinarians: Veterinarian[];
  onEdit: (veterinarian: Veterinarian) => void;
  onDelete: (veterinarianId: string) => void;
}

const VeterinarianTable: React.FC<VeterinarianTableProps> = ({
  veterinarians,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    {
      field: "speciality",
      headerName: "Speciality",
      width: 150,
      valueFormatter: (params) => params || "-",
    },
    {
      field: "isAvailable",
      headerName: "Available",
      width: 100,
      type: "boolean",
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
          onClick={() => onEdit(params.row as Veterinarian)}
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
        rows={veterinarians}
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

export default VeterinarianTable;
