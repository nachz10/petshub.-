import { api } from "./api";

export interface ProductImageAPI {
  id: string;
  url: string;
  isPrimary: boolean;
  productId: string;
}

export interface CategoryAPI {
  id: string;
  name: string;
}

export interface AnimalTypeAPI {
  id: string;
  name: string;
}

export interface ProductTypeAttributeDefinitionAPI {
  id: string;
  name: string;
  description: string | null;
  isRequired: boolean;
}

export interface ProductTypeAPI {
  id: string;
  name: string;
  attributes: ProductTypeAttributeDefinitionAPI[];
}

export interface ProductAnimalTargetAPI {
  id: string;
  animalType: AnimalTypeAPI;
  animalTypeId: string;
}

export interface ProductAttributeInstanceAPI {
  id: string;
  name: string;
  value: string;
}

export interface PolicyAPI {
  id: string;
  policyType: string;
  description: string;
  duration: number | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  availableUnits: number;
  isFeatured: boolean;
  freeShipping: boolean;
  returnPolicy: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: CategoryAPI;
  productTypeId: string;
  productType: ProductTypeAPI;
  images: ProductImageAPI[];
  animalTargets: ProductAnimalTargetAPI[];
  attributes: ProductAttributeInstanceAPI[];
  policies: PolicyAPI[];
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("/admin/products");
  return response.data.products.map((p: Product) => ({
    ...p,
    price: parseFloat(p.price as any),
  }));
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/admin/products/${id}`);
  return {
    ...response.data.product,
    price: parseFloat(response.data.product.price as any),
  };
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await api.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return {
    ...response.data.product,
    price: parseFloat(response.data.product.price as any),
  };
};

export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<Product> => {
  const response = await api.put(`/admin/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return {
    ...response.data.product,
    price: parseFloat(response.data.product.price as any),
  };
};

export const deleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};
