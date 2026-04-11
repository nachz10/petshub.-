import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

export type AnimalType = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

interface AnimalTypeEditModalProps {
  open: boolean;
  animalType: AnimalType | null;
  onClose: () => void;
  onSave: (animalType: AnimalType) => void;
}

export interface AnimalTypeFormData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const AnimalTypeEditModal: React.FC<AnimalTypeEditModalProps> = ({
  open,
  animalType,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<AnimalTypeFormData>({
    id: "",
    name: "",
    description: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (animalType) {
      setFormData({
        id: animalType.id,
        name: animalType.name,
        description: animalType.description || "",
        imageUrl: animalType.imageUrl || "",
      });
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        imageUrl: "",
      });
    }
    setErrors({});
  }, [animalType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {animalType?.id ? "Edit Animal Type" : "Add Animal Type"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            name="name"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />

          <TextField
            name="imageUrl"
            label="Image URL"
            fullWidth
            value={formData.imageUrl}
            onChange={handleChange}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl}
          />

          {formData.imageUrl && (
            <Box mt={2}>
              <img
                src={formData.imageUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnimalTypeEditModal;
