import { api } from "./api";

export const getVeterinarians = async () => {
  try {
    const response = await api.get("/admin/veterinarians");
    return response.data.veterinarians;
  } catch (error) {
    console.error("Error fetching veterinarians:", error);
    throw error;
  }
};

export const createVeterinarian = async (data: {
  fullName: string;
  speciality?: string;
  bio?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}) => {
  try {
    const response = await api.post("/admin/veterinarians", data);
    return response.data.veterinarian;
  } catch (error) {
    console.error("Error creating veterinarian:", error);
    throw error;
  }
};

export const updateVeterinarian = async ({
  id,
  ...data
}: {
  id: string;
  fullName?: string;
  speciality?: string;
  bio?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}) => {
  try {
    const response = await api.put(`/admin/veterinarians/${id}`, data);
    return response.data.veterinarian;
  } catch (error) {
    console.error("Error updating veterinarian:", error);
    throw error;
  }
};

export const deleteVeterinarian = async (id: string) => {
  try {
    const response = await api.delete(`/admin/veterinarians/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting veterinarian:", error);
    throw error;
  }
};
