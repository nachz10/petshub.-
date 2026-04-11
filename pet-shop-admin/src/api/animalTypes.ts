import { api } from "./api";

export const getAnimalTypes = async () => {
  try {
    const response = await api.get("/admin/animal-types");
    return response.data.animalTypes;
  } catch (error) {
    console.error("Error fetching animal types:", error);
    throw error;
  }
};

export const createAnimalType = async (data: {
  name: string;
  description?: string;
  imageUrl?: string;
}) => {
  try {
    const response = await api.post("/admin/animal-types", data);
    return response.data.animalType;
  } catch (error) {
    console.error("Error creating animal type:", error);
    throw error;
  }
};

export const updateAnimalType = async ({
  id,
  ...data
}: {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}) => {
  try {
    const response = await api.put(`/admin/animal-types/${id}`, data);
    return response.data.animalType;
  } catch (error) {
    console.error("Error updating animal type:", error);
    throw error;
  }
};

export const deleteAnimalType = async (id: string) => {
  try {
    const response = await api.delete(`/admin/animal-types/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting animal type:", error);
    throw error;
  }
};
