import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Box } from "@mui/material";
import ProductTable from "../components/products/PorductTable";
import ProductEditModal from "../components/products/ProductEditModal";
import DeleteConfirmation from "../components/DeleteConfirmationDialog";
import {
  fetchProducts,
  fetchCategories,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
} from "../api/product";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category: { id: string; name: string };
  imageUrl: string;
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<
    {
      id: string;
      name: string;
      Description?: string;
      imageUrl?: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDeleteId, setProductToDeleteId] = useState<number | null>(
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

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      setError("Failed to load products. Please try again later.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (productId: number) => {
    setProductToDeleteId(productId);
    setDeleteDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setProductToDeleteId(null);
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      const productData = {
        ...updatedProduct,
        categoryId:
          updatedProduct.categoryId || updatedProduct.category?.id || "",
      };

      if (updatedProduct.id === 0) {
        const { id, category, ...productDataToSend } = productData;
        const newProduct = await createNewProduct(productDataToSend);
        setProducts([...products, newProduct]);
        setNotification({
          open: true,
          message: "Product created successfully!",
          severity: "success",
        });
      } else {
        const { category, ...productDataToSend } = productData;
        const result = await updateExistingProduct(
          updatedProduct.id,
          productDataToSend
        );
        setProducts(
          products.map((product) =>
            product.id === updatedProduct.id
              ? { ...result, category: updatedProduct.category }
              : product
          )
        );
        setNotification({
          open: true,
          message: "Product updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setNotification({
        open: true,
        message: "Failed to save product. Please try again.",
        severity: "error",
      });
    } finally {
      setEditModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDeleteId) return;

    try {
      await deleteExistingProduct(productToDeleteId);
      setProducts(
        products.filter((product) => product.id !== productToDeleteId)
      );
      setNotification({
        open: true,
        message: "Product deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setNotification({
        open: true,
        message: "Failed to delete product. Please try again.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDeleteId(null);
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
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedProduct({
              id: 0,
              name: "",
              description: "",
              price: 0,
              categoryId: "",
              category: { id: "", name: "" },
              imageUrl: "",
            });
            setEditModalOpen(true);
          }}
        >
          Add New Product
        </Button>
      </Box>

      <ProductTable
        products={products}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <ProductEditModal
        open={editModalOpen}
        product={selectedProduct}
        onClose={handleEditClose}
        onSave={handleSaveProduct}
        categories={categories}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
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
    </div>
  );
};

export default Products;
