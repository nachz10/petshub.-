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

export type Category = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
};

interface CategoryEditModalProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
}

export interface CategoryFormData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  open,
  category,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    id: "",
    name: "",
    description: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description || "",
        imageUrl: category.imageUrl,
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
  }, [category]);

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
        {category?.id ? "Edit Category" : "Add Category"}
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

export default CategoryEditModal;
