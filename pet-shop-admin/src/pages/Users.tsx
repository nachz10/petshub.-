import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Box } from "@mui/material";
import UserTable, { User } from "../components/user/UserTable";
import UserEditModal from "../components/user/UserEditModal";
import DeleteConfirmation from "../components/DeleteConfirmationDialog";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/user";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      setError("Failed to load users. Please try again later.");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDeleteId(userId);
    setDeleteDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setUserToDeleteId(null);
  };

  const handleSaveUser = async (userData: User, password?: string) => {
    try {
      if (!userData.id) {
        if (!password) {
          throw new Error("Password is required for new users");
        }

        const newUser = await createUser({
          email: userData.email,
          fullName: userData.fullName,
          password: password,
        });

        setUsers([...users, newUser]);
        setNotification({
          open: true,
          message: "User created successfully!",
          severity: "success",
        });
      } else {
        const updateData: {
          email?: string;
          fullName?: string;
          password?: string;
        } = {
          email: userData.email,
          fullName: userData.fullName,
        };

        if (password) {
          updateData.password = password;
        }

        const updatedUser = await updateUser(userData.id, updateData);

        setUsers(
          users.map((user) =>
            user.id === userData.id ? { ...user, ...updatedUser } : user
          )
        );

        setNotification({
          open: true,
          message: "User updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setNotification({
        open: true,
        message:
          typeof error === "object" && error !== null && "message" in error
            ? (error as Error).message
            : "Failed to save user. Please try again.",
        severity: "error",
      });
    } finally {
      setEditModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDeleteId) return;

    try {
      await deleteUser(userToDeleteId);
      setUsers(users.filter((user) => user.id !== userToDeleteId));
      setNotification({
        open: true,
        message: "User deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setNotification({
        open: true,
        message: "Failed to delete user. Please try again.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDeleteId(null);
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
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedUser(null);
            setEditModalOpen(true);
          }}
        >
          Add New User
        </Button>
      </Box>

      <UserTable
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <UserEditModal
        open={editModalOpen}
        user={selectedUser}
        onClose={handleEditClose}
        onSave={handleSaveUser}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        content="Are you sure you want to delete this user? This action cannot be undone."
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

export default Users;
