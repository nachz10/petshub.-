import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Box } from "@mui/material";
import AnimalTypeTable, {
  type AnimalType,
} from "../components/animalTypes/AnimalTypesTable";
import AnimalTypeEditModal from "../components/animalTypes/AnimalTypesEditModal";
import DeleteConfirmation from "../components/DeleteConfirmationDialog";
import {
  getAnimalTypes,
  createAnimalType,
  updateAnimalType,
  deleteAnimalType,
} from "../api/animalTypes";

const AnimalTypes: React.FC = () => {
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedAnimalType, setSelectedAnimalType] =
    useState<AnimalType | null>(null);
  const [animalTypeToDeleteId, setAnimalTypeToDeleteId] = useState<
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

  const loadAnimalTypes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAnimalTypes();
      setAnimalTypes(data);
    } catch (error) {
      setError("Failed to load animal types. Please try again later.");
      console.error("Error fetching animal types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimalTypes();
  }, []);

  const handleEditClick = (animalType: AnimalType) => {
    setSelectedAnimalType(animalType);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (animalTypeId: string) => {
    setAnimalTypeToDeleteId(animalTypeId);
    setDeleteDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedAnimalType(null);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setAnimalTypeToDeleteId(null);
  };

  const handleSaveAnimalType = async (animalTypeData: AnimalType) => {
    try {
      if (!animalTypeData.id) {
        // Create new animal type
        const newAnimalType = await createAnimalType({
          name: animalTypeData.name,
          description: animalTypeData.description || undefined,
          imageUrl: animalTypeData.imageUrl || undefined,
        });
        setAnimalTypes([...animalTypes, newAnimalType]);
        setNotification({
          open: true,
          message: "Animal type created successfully!",
          severity: "success",
        });
      } else {
        // Update existing animal type
        const updatedAnimalType = await updateAnimalType({
          id: animalTypeData.id,
          name: animalTypeData.name,
          description: animalTypeData.description || undefined,
          imageUrl: animalTypeData.imageUrl || undefined,
        });

        setAnimalTypes(
          animalTypes.map((at) =>
            at.id === animalTypeData.id ? { ...at, ...updatedAnimalType } : at
          )
        );

        setNotification({
          open: true,
          message: "Animal type updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error saving animal type:", error);
      setNotification({
        open: true,
        message:
          typeof error === "object" && error !== null && "message" in error
            ? (error as Error).message
            : "Failed to save animal type. Please try again.",
        severity: "error",
      });
    } finally {
      setEditModalOpen(false);
      setSelectedAnimalType(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!animalTypeToDeleteId) return;

    try {
      await deleteAnimalType(animalTypeToDeleteId);
      setAnimalTypes(
        animalTypes.filter((at) => at.id !== animalTypeToDeleteId)
      );
      setNotification({
        open: true,
        message: "Animal type deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting animal type:", error);
      setNotification({
        open: true,
        message: "Failed to delete animal type. Please try again.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAnimalTypeToDeleteId(null);
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
        <h1 className="text-2xl font-bold">Animal Types</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedAnimalType(null);
            setEditModalOpen(true);
          }}
        >
          Add New Animal Type
        </Button>
      </Box>

      <AnimalTypeTable
        animalTypes={animalTypes}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <AnimalTypeEditModal
        open={editModalOpen}
        animalType={selectedAnimalType}
        onClose={handleEditClose}
        onSave={handleSaveAnimalType}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete Animal Type"
        content="Are you sure you want to delete this animal type? This action cannot be undone."
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

export default AnimalTypes;
