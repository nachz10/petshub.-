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

export type ProductType = {
  id: string;
  name: string;
  description: string | null;
};

interface ProductTypeEditModalProps {
  open: boolean;
  productType: ProductType | null;
  onClose: () => void;
  onSave: (productType: ProductType) => void;
}

export interface ProductTypeFormData {
  id: string;
  name: string;
  description: string;
}

const ProductTypeEditModal: React.FC<ProductTypeEditModalProps> = ({
  open,
  productType,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProductTypeFormData>({
    id: "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (productType) {
      setFormData({
        id: productType.id,
        name: productType.name,
        description: productType.description || "",
      });
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
      });
    }
    setErrors({});
  }, [productType]);

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
        {productType?.id ? "Edit Product Type" : "Add Product Type"}
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

export default ProductTypeEditModal;
