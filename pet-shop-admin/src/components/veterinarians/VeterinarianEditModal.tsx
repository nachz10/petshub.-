import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";

export type Veterinarian = {
  id: string;
  fullName: string;
  speciality: string | null;
  bio: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
};

interface VeterinarianEditModalProps {
  open: boolean;
  veterinarian: Veterinarian | null;
  onClose: () => void;
  onSave: (veterinarian: Veterinarian) => void;
}

export interface VeterinarianFormData {
  id: string;
  fullName: string;
  speciality: string;
  bio: string;
  imageUrl: string;
  isAvailable: boolean;
}

const VeterinarianEditModal: React.FC<VeterinarianEditModalProps> = ({
  open,
  veterinarian,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<VeterinarianFormData>({
    id: "",
    fullName: "",
    speciality: "",
    bio: "",
    imageUrl: "",
    isAvailable: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (veterinarian) {
      setFormData({
        id: veterinarian.id,
        fullName: veterinarian.fullName,
        speciality: veterinarian.speciality || "",
        bio: veterinarian.bio || "",
        imageUrl: veterinarian.imageUrl || "",
        isAvailable: veterinarian.isAvailable,
      });
    } else {
      setFormData({
        id: "",
        fullName: "",
        speciality: "",
        bio: "",
        imageUrl: "",
        isAvailable: true,
      });
    }
    setErrors({});
  }, [veterinarian]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
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
        {veterinarian?.id ? "Edit Veterinarian" : "Add Veterinarian"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            name="fullName"
            label="Full Name"
            fullWidth
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
          />

          <TextField
            name="speciality"
            label="Speciality"
            fullWidth
            value={formData.speciality}
            onChange={handleChange}
            error={!!errors.speciality}
            helperText={errors.speciality}
          />

          <TextField
            name="bio"
            label="Bio"
            fullWidth
            multiline
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            error={!!errors.bio}
            helperText={errors.bio}
          />

          <FormControlLabel
            control={
              <Switch
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label="Available for appointments"
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

export default VeterinarianEditModal;
