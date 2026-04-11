import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Box } from "@mui/material";
import CategoryTable, {
  Category,
} from "../components/categories/CategoriesTable";
import CategoryEditModal from "../components/categories/CategoryEditModal";
import DeleteConfirmation from "../components/DeleteConfirmationDialog";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categories";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(
    null
  );
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError("Failed to load categories. Please try again later.");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDeleteId(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setCategoryToDeleteId(null);
  };

  const handleSaveCategory = async (categoryData: Category) => {
    try {
      if (!categoryData.id) {
        // Create new category
        const newCategory = await createCategory({
          name: categoryData.name,
          description: categoryData.description || undefined,
          imageUrl: categoryData.imageUrl,
        });
        setCategories([...categories, newCategory]);
        setNotification({
          open: true,
          message: "Category created successfully!",
          severity: "success",
        });
      } else {
        // Update existing category
        const updatedCategory = await updateCategory({
          id: categoryData.id,
          name: categoryData.name,
          description: categoryData.description || undefined,
          imageUrl: categoryData.imageUrl,
        });
        console.log("New category created:", updatedCategory);

        setCategories(
          categories.map((cat) =>
            cat.id === categoryData.id ? { ...cat, ...updatedCategory } : cat
          )
        );

        setNotification({
          open: true,
          message: "Category updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setNotification({
        open: true,
        message:
          typeof error === "object" && error !== null && "message" in error
            ? (error as Error).message
            : "Failed to save category. Please try again.",
        severity: "error",
      });
    } finally {
      setEditModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDeleteId) return;

    try {
      await deleteCategory(categoryToDeleteId);
      setCategories(categories.filter((cat) => cat.id !== categoryToDeleteId));
      setNotification({
        open: true,
        message: "Category deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      setNotification({
        open: true,
        message: "Failed to delete category. Please try again.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDeleteId(null);
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
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedCategory(null);
            setEditModalOpen(true);
          }}
        >
          Add New Category
        </Button>
      </Box>

      <CategoryTable
        categories={categories}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <CategoryEditModal
        open={editModalOpen}
        category={selectedCategory}
        onClose={handleEditClose}
        onSave={handleSaveCategory}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        content="Are you sure you want to delete this category? This action cannot be undone."
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

export default Categories;
