import { api } from "./api";

export const getCategories = async () => {
  try {
    const response = await api.get("/admin/categories");
    return response.data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (data: {
  name: string;
  description?: string;
  imageUrl?: string;
}) => {
  try {
    const response = await api.post("/admin/categories", data);
    return response.data.category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async ({
  id,
  ...data
}: {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}) => {
  try {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data.category;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
