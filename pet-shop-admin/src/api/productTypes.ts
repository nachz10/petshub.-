import { api } from "./api";

export const getProductTypes = async () => {
  try {
    const response = await api.get("/admin/product-types");
    return response.data.productTypes;
  } catch (error) {
    console.error("Error fetching product types:", error);
    throw error;
  }
};

export const createProductType = async (data: {
  name: string;
  description?: string;
}) => {
  try {
    const response = await api.post("/admin/product-types", data);
    return response.data.productType;
  } catch (error) {
    console.error("Error creating product type:", error);
    throw error;
  }
};

export const updateProductType = async ({
  id,
  ...data
}: {
  id: string;
  name?: string;
  description?: string;
}) => {
  try {
    const response = await api.put(`/admin/product-types/${id}`, data);
    return response.data.productType;
  } catch (error) {
    console.error("Error updating product type:", error);
    throw error;
  }
};

export const deleteProductType = async (id: string) => {
  try {
    const response = await api.delete(`/admin/product-types/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product type:", error);
    throw error;
  }
};
