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
import type { User } from "./UserTable";

interface UserEditModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User, password?: string) => void;
}

export interface UserFormData extends Omit<User, "createdAt" | "updatedAt"> {
  password?: string;
  confirmPassword?: string;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  open,
  user,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      const { createdAt, updatedAt, ...userData } = user;
      setFormData({ ...userData, password: "", confirmPassword: "" });
    } else {
      setFormData({
        id: "",
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
      });
    }
    setErrors({});
  }, [user]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!user?.id) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const { confirmPassword, ...userData } = formData;
      onSave(userData as User, userData.password);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{user?.id ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            name="fullName"
            label="Full Name"
            fullWidth
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />

          <TextField
            name="password"
            label={
              user?.id
                ? "New Password (leave blank to keep current)"
                : "Password"
            }
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />

          {(!!formData.password || !user?.id) && (
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
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

export default UserEditModal;
