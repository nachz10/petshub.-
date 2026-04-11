import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import ProductsTable from "../components/newProduct/NewProductTable";
import ProductEditModal from "../components/newProduct/NewProductEditModal";
import DeleteConfirmation from "../components/DeleteConfirmationDialog";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct as apiDeleteProduct,
  Product,
} from "../api/newProduct";

const NewProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(
    null
  );
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(
        err.message || "Failed to load products. Please try again later."
      );
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDeleteId(productId);
    setDeleteDialogOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setProductToDeleteId(null);
  };

  const handleSaveProduct = async (
    formData: FormData,
    productId: string | null
  ) => {
    setOperationLoading(true);
    try {
      if (productId) {
        const updated = await updateProduct(productId, formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? updated : p))
        );
        setNotification({
          open: true,
          message: "Product updated successfully!",
          severity: "success",
        });
      } else {
        const newProductData = await createProduct(formData);
        setProducts((prev) => [newProductData, ...prev]);
        setNotification({
          open: true,
          message: "Product created successfully!",
          severity: "success",
        });
      }
      handleModalClose();
    } catch (err: any) {
      console.error("Error saving product:", err);
      const serverMessage = err.response?.data?.message || err.message;
      setNotification({
        open: true,
        message: serverMessage || "Failed to save product.",
        severity: "error",
      });
      throw err;
    } finally {
      setOperationLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDeleteId) return;
    setOperationLoading(true);
    try {
      await apiDeleteProduct(productToDeleteId);
      setProducts(products.filter((p) => p.id !== productToDeleteId));
      setNotification({
        open: true,
        message: "Product deleted successfully!",
        severity: "success",
      });
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setNotification({
        open: true,
        message: err.response?.data?.message || "Failed to delete product.",
        severity: "error",
      });
    } finally {
      handleDeleteDialogClose();
      setOperationLoading(false);
    }
  };

  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Paper sx={{ p: 2, margin: "auto", boxShadow: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" component="h1">
          Manage Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedProduct(null);
            setEditModalOpen(true);
          }}
          disabled={operationLoading}
        >
          Add New Product
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadProducts}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : (
        <ProductsTable
          products={products}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Conditional rendering of modal for performance and clean state */}
      {editModalOpen && (
        <ProductEditModal
          open={editModalOpen}
          product={selectedProduct}
          onClose={handleModalClose}
          onSave={handleSaveProduct}
        />
      )}

      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        content="Are you sure you want to delete this product? This action cannot be undone."
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
      {operationLoading && (
        <CircularProgress
          size={24}
          sx={{ position: "fixed", bottom: 16, left: 16 }}
        />
      )}
    </Paper>
  );
};

export default NewProductsPage;
