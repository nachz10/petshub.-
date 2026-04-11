import React from "react";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Delete, CancelOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Appointment, AppointmentStatus } from "../../api/appointment";

interface AppointmentTableProps {
  appointments: Appointment[];
  onStatusChange: (
    appointment: Appointment,
    newStatus: AppointmentStatus
  ) => void;
  onOpenCancelDialog: (appointmentId: string) => void;
  onDelete: (appointmentId: string) => void;
}

const editableStatusOptions: { value: AppointmentStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
];

const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case "completed":
      return "#4caf50"; // green
    case "cancelled":
      return "#f44336"; // red
    case "confirmed":
      return "#2196f3"; // blue
    case "scheduled":
    default:
      return "#ff9800"; // orange
  }
};

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onStatusChange,
  onOpenCancelDialog,
  onDelete,
}) => {
  const columns: GridColDef<Appointment>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      renderCell: (params: GridRenderCellParams<Appointment, string>) => (
        <Tooltip title={params.value || ""}>
          <span>{params.value?.substring(0, 8)}...</span>
        </Tooltip>
      ),
    },
    {
      field: "userEmail",
      headerName: "Booked By",
      width: 150,
      valueGetter: (value, row) => row.pet.owner.email,
      renderCell: (params) => (
        <Tooltip title={params.row.pet.owner.email}>
          <span>{params.row.pet.owner.email}</span>
        </Tooltip>
      ),
    },
    {
      field: "petName",
      headerName: "Pet",
      width: 60,
      valueGetter: (value, row) => row.pet.name,
    },
    {
      field: "serviceName",
      headerName: "Service",
      width: 150,
      valueGetter: (value, row) => row.service.name,
    },
    {
      field: "veterinarianName",
      headerName: "Veterinarian",
      width: 150,
      valueGetter: (value, row) => row.veterinarian.fullName,
    },
    {
      field: "date",
      headerName: "Date & Time",
      width: 150,
      type: "dateTime",
      valueGetter: (value) => new Date(value as string),
      valueFormatter: (value) => new Date(value as Date).toLocaleString(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      type: "singleSelect",
      valueOptions: editableStatusOptions,
      editable: true,
      renderCell: (
        params: GridRenderCellParams<Appointment, AppointmentStatus>
      ) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: getStatusColor(params.value || "scheduled"),
            color: "white",
            fontSize: "0.8rem",
            textTransform: "capitalize",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Booked On",
      width: 120,
      type: "date",
      valueGetter: (value) => new Date(value as string),
      valueFormatter: (value) => new Date(value as Date).toLocaleDateString(),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 80,
      getActions: (params) => {
        const appointment = params.row as Appointment;
        const actions = [
          <GridActionsCellItem
            icon={
              <Tooltip title="Delete">
                <Delete />
              </Tooltip>
            }
            label="Delete"
            onClick={() => onDelete(appointment.id)}
            key={`delete-${appointment.id}`}
            color="error"
          />,
        ];
        if (
          appointment.status !== "completed" &&
          appointment.status !== "cancelled"
        ) {
          actions.unshift(
            <GridActionsCellItem
              icon={
                <Tooltip title="Cancel Appointment">
                  <CancelOutlined />
                </Tooltip>
              }
              label="Cancel Appointment"
              onClick={() => onOpenCancelDialog(appointment.id)}
              key={`cancel-${appointment.id}`}
              color="warning"
            />
          );
        }
        return actions;
      },
    },
  ];

  const handleProcessRowUpdate = (
    updatedRow: Appointment,
    originalRow: Appointment
  ) => {
    if (
      updatedRow.status !== originalRow.status &&
      updatedRow.status !== "cancelled"
    ) {
      onStatusChange(updatedRow, updatedRow.status);
    }
    return updatedRow;
  };

  return (
    <div
      style={{
        height: "calc(100vh - 250px)",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={appointments}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
          sorting: {
            sortModel: [{ field: "date", sort: "desc" }],
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        processRowUpdate={handleProcessRowUpdate}
        density="compact"
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "grey.200",
          },
        }}
      />
    </div>
  );
};

export default AppointmentTable;
