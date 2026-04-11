import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Box } from "@mui/material";
import ProductTypeTable, {
  ProductType,
} from "../components/productTypes/ProductTypesTable";
import ProductTypeEditModal from "../components/productTypes/ProductTypeEditModal";
import DeleteConfirmation from "../components/DeleteConfirmationDialog";
import {
  getProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from "../api/productTypes";

const ProductTypes: React.FC = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null);
  const [productTypeToDeleteId, setProductTypeToDeleteId] = useState<
    string | null
  >(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadProductTypes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProductTypes();
      setProductTypes(data);
    } catch (error) {
      setError("Failed to load product types. Please try again later.");
      console.error("Error fetching product types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductTypes();
  }, []);

  const handleEditClick = (productType: ProductType) => {
    setSelectedProductType(productType);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (productTypeId: string) => {
    setProductTypeToDeleteId(productTypeId);
    setDeleteDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedProductType(null);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setProductTypeToDeleteId(null);
  };

  const handleSaveProductType = async (productTypeData: ProductType) => {
    try {
      if (!productTypeData.id) {
        const newProductType = await createProductType({
          name: productTypeData.name,
          description: productTypeData.description || undefined,
        });
        setProductTypes([...productTypes, newProductType]);
        setNotification({
          open: true,
          message: "Product type created successfully!",
          severity: "success",
        });
      } else {
        const updatedProductType = await updateProductType({
          id: productTypeData.id,
          name: productTypeData.name,
          description: productTypeData.description || undefined,
        });

        setProductTypes(
          productTypes.map((pt) =>
            pt.id === productTypeData.id ? { ...pt, ...updatedProductType } : pt
          )
        );

        setNotification({
          open: true,
          message: "Product type updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error saving product type:", error);
      setNotification({
        open: true,
        message:
          typeof error === "object" && error !== null && "message" in error
            ? (error as Error).message
            : "Failed to save product type. Please try again.",
        severity: "error",
      });
    } finally {
      setEditModalOpen(false);
      setSelectedProductType(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productTypeToDeleteId) return;

    try {
      await deleteProductType(productTypeToDeleteId);
      setProductTypes(
        productTypes.filter((pt) => pt.id !== productTypeToDeleteId)
      );
      setNotification({
        open: true,
        message: "Product type deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting product type:", error);
      setNotification({
        open: true,
        message: "Failed to delete product type. Please try again.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductTypeToDeleteId(null);
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
        <h1 className="text-2xl font-bold">Product Types</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedProductType(null);
            setEditModalOpen(true);
          }}
        >
          Add New Product Type
        </Button>
      </Box>

      <ProductTypeTable
        productTypes={productTypes}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <ProductTypeEditModal
        open={editModalOpen}
        productType={selectedProductType}
        onClose={handleEditClose}
        onSave={handleSaveProductType}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete Product Type"
        content="Are you sure you want to delete this product type? This action cannot be undone."
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

export default ProductTypes;
