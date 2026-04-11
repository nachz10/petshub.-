import axios from "axios";

export interface NavCategory {
  id: string;
  name: string;
  imageUrl?: string;
}

interface NavCategoriesApiResponse {
  categories: NavCategory[];
}

export const fetchNavCategories = async (): Promise<NavCategory[]> => {
  try {
    const response = await axios.get<NavCategoriesApiResponse>(
      "http://localhost:3000/api/products/navCategories",
      { withCredentials: true }
    );
    return response.data.categories;
  } catch (error) {
    console.error("Failed to fetch navigation categories:", error);
    throw new Response("Failed to load navigation categories", { status: 500 });
  }
};
