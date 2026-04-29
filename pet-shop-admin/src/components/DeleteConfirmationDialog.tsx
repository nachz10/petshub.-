import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";


interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  isForUpdate?: boolean;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  isForUpdate = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {isForUpdate ? "Update" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
