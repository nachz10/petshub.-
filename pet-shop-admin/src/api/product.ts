import axios from "axios";
import { type Product } from "../components/products/PorductTable";

const API_URL = "http://localhost:3000/api";

export const fetchProducts = async () => {
  try {
    const response = await axios.get<{ products: Product[] }>(
      `${API_URL}/products`,
      { withCredentials: true }
    );
    console.log(response.data.products);
    return response.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get<{
      categories: { id: string; name: string }[];
    }>(`${API_URL}/products/categories`, { withCredentials: true });
    return response.data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchProductById = async (id: number) => {
  try {
    const response = await axios.get<{ product: Product }>(
      `${API_URL}/products/${id}`,
      { withCredentials: true }
    );
    return response.data.product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const createNewProduct = async (
  productData: Omit<Product, "id" | "category">
) => {
  try {
    const response = await axios.post<{ product: Product }>(
      `${API_URL}/products`,
      productData,
      { withCredentials: true }
    );
    return response.data.product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateExistingProduct = async (
  id: number,
  productData: Partial<Product>
) => {
  try {
    const response = await axios.put<{ updatedProduct: Product }>(
      `${API_URL}/products/${id}`,
      productData,
      { withCredentials: true }
    );
    return response.data.updatedProduct;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

export const deleteExistingProduct = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};
