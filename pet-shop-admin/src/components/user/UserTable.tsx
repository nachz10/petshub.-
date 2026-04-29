import React from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit, Block } from "@mui/icons-material";

export type User = {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  isBlocked?: boolean;
};

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onBlock: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onBlock }) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      valueFormatter: (params: any) => {
        return params ? new Date(params).toLocaleDateString() : "";
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 150,
      valueFormatter: (params: any) => {
        return params ? new Date(params).toLocaleDateString() : "";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      valueGetter: (value, row) => {
        // Using the simpler signature: valueGetter = (value, row)
        return row.isBlocked ? "Blocked" : "Active";
      },
      cellClassName: (params) => {
        return params.value === "Blocked" ? "status-blocked" : "status-active";
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => onEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<Block />}
          label={params.row.isBlocked ? "Unblock" : "Block"}
          onClick={() => onBlock(params.row)}
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
      <style>{`
        .status-blocked {
          color: #f44336;
          font-weight: 500;
        }
        .status-active {
          color: #4caf50;
          font-weight: 500;
        }
        .block-action {
          color: #ff9800;
        }
        .unblock-action {
          color: #2196f3;
        }
      `}</style>
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