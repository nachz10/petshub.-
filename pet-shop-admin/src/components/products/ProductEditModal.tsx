import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import type { Product } from "./products/PorductTable";

interface ProductEditModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: {
    id: string;
    name: string;
    Description?: string;
    imageUrl?: string;
  }[];
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  open,
  product,
  onClose,
  onSave,
  categories,
}) => {
  const [formData, setFormData] = useState<Product | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData(null);
    }
    setErrors({});
  }, [product]);

  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      // Special handling for category selection
      if (name === "category") {
        const categoryId = value as string;
        const selectedCategory = categories.find(
          (cat) => cat.id === categoryId
        );

        setFormData({
          ...formData,
          categoryId: categoryId,
          category: {
            id: categoryId,
            name: selectedCategory?.name || "",
          },
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }

      // Clear error when field is edited
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.categoryId) {
      newErrors.category = "Category is required";
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
        {product && product.id !== 0 ? "Edit Product" : "Add Product"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            name="name"
            label="Product Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
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
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            error={!!errors.price}
            helperText={errors.price}
          />

          <FormControl fullWidth error={!!errors.category}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.categoryId || ""}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Box
                sx={{
                  color: "error.main",
                  fontSize: "0.75rem",
                  mt: 0.5,
                  ml: 1.75,
                }}
              >
                {errors.category}
              </Box>
            )}
          </FormControl>

          <TextField
            name="imageUrl"
            label="Image URL"
            fullWidth
            value={formData.imageUrl}
            onChange={handleChange}
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

export default ProductEditModal;
