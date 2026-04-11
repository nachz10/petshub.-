import React from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";

export type User = {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
};

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      valueFormatter: (params: any) => {
        return new Date(params as string).toLocaleDateString();
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 150,
      valueFormatter: (params: any) => {
        return new Date(params as string).toLocaleDateString();
      },
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
          onClick={() => onEdit(params.row as User)}
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
        rows={users}
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

export default UserTable;
