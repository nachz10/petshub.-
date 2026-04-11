import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

interface CancellationReasonDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  contentText: string;
  orderIdShort: string;
}

const CancellationReasonDialog: React.FC<CancellationReasonDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  contentText,
  orderIdShort,
}) => {
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleConfirm = () => {
    if (reason.trim() === "") {
      setError("Cancellation reason cannot be empty.");
      return;
    }
    setError("");
    onConfirm(reason);
    setReason("");
  };

  const handleDialogClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {contentText} (Order ID: {orderIdShort}...)
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="cancellationReason"
          label="Reason for Cancellation"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (e.target.value.trim() !== "") setError("");
          }}
          error={!!error}
          helperText={error}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={handleDialogClose} color="inherit">
          Back
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error">
          Confirm Cancellation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancellationReasonDialog;
