import React, { useEffect, useState, useCallback } from "react";
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import AppointmentTable from "../components/appointments/AppointmentTable";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import CancellationReasonDialog from "../components/order/CalcellationDialog";
import {
  fetchAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  Appointment,
  AppointmentStatus,
} from "../api/appointment";

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [appointmentToDeleteId, setAppointmentToDeleteId] = useState<
    string | null
  >(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);

  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      setError("Failed to load appointments. Please try again later.");
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleStatusChange = async (
    appointment: Appointment,
    newStatus: AppointmentStatus
  ) => {
    if (newStatus === "cancelled") {
      const aptToCancel = appointments.find((a) => a.id === appointment.id);
      if (aptToCancel) {
        setAppointmentToCancel(aptToCancel);
        setCancelDialogOpen(true);
      }
      return;
    }

    setActionLoading(true);
    try {
      const updatedAppointment = await updateAppointmentStatus(
        appointment.id,
        newStatus
      );
      setAppointments((prevApps) =>
        prevApps.map((a) => (a.id === appointment.id ? updatedAppointment : a))
      );
      setNotification({
        open: true,
        message: "Appointment status updated successfully!",
        severity: "success",
      });
    } catch (err: any) {
      console.error("Error updating appointment status:", err);
      setNotification({
        open: true,
        message:
          err.response?.data?.message || "Failed to update appointment status.",
        severity: "error",
      });
      loadAppointments();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (appointmentId: string) => {
    setAppointmentToDeleteId(appointmentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setAppointmentToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!appointmentToDeleteId) return;
    setActionLoading(true);
    try {
      await deleteAppointment(appointmentToDeleteId);
      setAppointments((prevApps) =>
        prevApps.filter((a) => a.id !== appointmentToDeleteId)
      );
      setNotification({
        open: true,
        message: "Appointment deleted successfully!",
        severity: "success",
      });
    } catch (err: any) {
      console.error("Error deleting appointment:", err);
      setNotification({
        open: true,
        message: err.response?.data?.message || "Failed to delete appointment.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAppointmentToDeleteId(null);
      setActionLoading(false);
    }
  };

  const handleOpenCancelDialog = (appointmentId: string) => {
    const aptToCancel = appointments.find((a) => a.id === appointmentId);
    if (aptToCancel) {
      setAppointmentToCancel(aptToCancel);
      setCancelDialogOpen(true);
    }
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setAppointmentToCancel(null);
  };

  const handleConfirmAppointmentCancellation = async (reason: string) => {
    if (!appointmentToCancel) return;
    setActionLoading(true);
    setCancelDialogOpen(false);
    try {
      const updatedAppointment = await updateAppointmentStatus(
        appointmentToCancel.id,
        "cancelled",
        reason
      );
      setAppointments((prevApps) =>
        prevApps.map((a) =>
          a.id === appointmentToCancel.id ? updatedAppointment : a
        )
      );
      setNotification({
        open: true,
        message: `Appointment ${appointmentToCancel.id.substring(
          0,
          8
        )}... cancelled. User notified.`,
        severity: "success",
      });
    } catch (err: any) {
      console.error("Error cancelling appointment:", err);
      setNotification({
        open: true,
        message: err.response?.data?.message || "Failed to cancel appointment.",
        severity: "error",
      });
      loadAppointments();
    } finally {
      setAppointmentToCancel(null);
      setActionLoading(false);
    }
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

  if (loading && appointments.length === 0) {
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
        Appointments Management
      </Typography>
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <AppointmentTable
        appointments={appointments}
        onStatusChange={handleStatusChange}
        onOpenCancelDialog={handleOpenCancelDialog}
        onDelete={handleDeleteClick}
      />
      {appointmentToDeleteId && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          onConfirm={handleConfirmDelete}
          title="Delete Appointment"
          content="Are you sure you want to delete this appointment? This action cannot be undone."
        />
      )}
      {appointmentToCancel && (
        <CancellationReasonDialog
          open={cancelDialogOpen}
          onClose={handleCancelDialogClose}
          onConfirm={handleConfirmAppointmentCancellation}
          title="Confirm Appointment Cancellation"
          contentText={`Please provide a reason for cancelling this appointment. The client will be notified.`}
          orderIdShort={appointmentToCancel.id.substring(0, 8)}
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

export default AppointmentsPage;
