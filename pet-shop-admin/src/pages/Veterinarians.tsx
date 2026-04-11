import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Box } from "@mui/material";
import VeterinarianTable, {
  Veterinarian,
} from "../components/veterinarians/VeterinariansTable";
import VeterinarianEditModal from "../components/veterinarians/VeterinarianEditModal";
import DeleteConfirmation from "../components/DeleteConfirmationDialog";
import {
  getVeterinarians,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
} from "../api/veterinarian";

const Veterinarians: React.FC = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedVeterinarian, setSelectedVeterinarian] =
    useState<Veterinarian | null>(null);
  const [veterinarianToDeleteId, setVeterinarianToDeleteId] = useState<
    string | null
  >(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadVeterinarians = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getVeterinarians();
      setVeterinarians(data);
    } catch (error) {
      setError("Failed to load veterinarians. Please try again later.");
      console.error("Error fetching veterinarians:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVeterinarians();
  }, []);

  const handleEditClick = (veterinarian: Veterinarian) => {
    setSelectedVeterinarian(veterinarian);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (veterinarianId: string) => {
    setVeterinarianToDeleteId(veterinarianId);
    setDeleteDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedVeterinarian(null);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setVeterinarianToDeleteId(null);
  };

  const handleSaveVeterinarian = async (veterinarianData: Veterinarian) => {
    try {
      if (!veterinarianData.id) {
        const newVeterinarian = await createVeterinarian({
          fullName: veterinarianData.fullName,
          speciality: veterinarianData.speciality || undefined,
          bio: veterinarianData.bio || undefined,
          imageUrl: veterinarianData.imageUrl || undefined,
          isAvailable: veterinarianData.isAvailable,
        });
        setVeterinarians([...veterinarians, newVeterinarian]);
        setNotification({
          open: true,
          message: "Veterinarian created successfully!",
          severity: "success",
        });
      } else {
        const updatedVeterinarian = await updateVeterinarian({
          id: veterinarianData.id,
          fullName: veterinarianData.fullName,
          speciality: veterinarianData.speciality || undefined,
          bio: veterinarianData.bio || undefined,
          imageUrl: veterinarianData.imageUrl || undefined,
          isAvailable: veterinarianData.isAvailable,
        });

        setVeterinarians(
          veterinarians.map((vet) =>
            vet.id === veterinarianData.id
              ? { ...vet, ...updatedVeterinarian }
              : vet
          )
        );

        setNotification({
          open: true,
          message: "Veterinarian updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error saving veterinarian:", error);
      setNotification({
        open: true,
        message:
          typeof error === "object" && error !== null && "message" in error
            ? (error as Error).message
            : "Failed to save veterinarian. Please try again.",
        severity: "error",
      });
    } finally {
      setEditModalOpen(false);
      setSelectedVeterinarian(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!veterinarianToDeleteId) return;

    try {
      await deleteVeterinarian(veterinarianToDeleteId);
      setVeterinarians(
        veterinarians.filter((vet) => vet.id !== veterinarianToDeleteId)
      );
      setNotification({
        open: true,
        message: "Veterinarian deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting veterinarian:", error);
      setNotification({
        open: true,
        message: "Failed to delete veterinarian. Please try again.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setVeterinarianToDeleteId(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <h1 className="text-2xl font-bold">Veterinarians</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedVeterinarian(null);
            setEditModalOpen(true);
          }}
        >
          Add New Veterinarian
        </Button>
      </Box>

      <VeterinarianTable
        veterinarians={veterinarians}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <VeterinarianEditModal
        open={editModalOpen}
        veterinarian={selectedVeterinarian}
        onClose={handleEditClose}
        onSave={handleSaveVeterinarian}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete Veterinarian"
        content="Are you sure you want to delete this veterinarian? This action cannot be undone."
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Veterinarians;
