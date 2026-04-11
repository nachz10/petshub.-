import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export type Category = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  availableUnits: number;
  freeShipping: boolean;
  returnPolicy: boolean;
  category: {
    id: string;
    name: string;
  };
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
  productType: {
    id: string;
    name: string;
  };
  policies: {
    id: string;
    policyType: string;
    description: string;
    duration?: number;
  }[];
  averageRating: number;
  totalReviews: number;
};

export type ReviewDetail = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    fullName: string;
  };
};

export type ProductDetailData = Product & {
  reviews: ReviewDetail[];
  canReview: boolean;
};

type DataContextType = {
  categories: Category[];
  products: Product[];
  featuredCategories: Category[];
  featuredProducts: Product[];
  fetchFeaturedCategories: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshFeaturedData: () => Promise<void>;
};

const defaultContextValue: DataContextType = {
  categories: [],
  products: [],
  featuredCategories: [],
  featuredProducts: [],
  loading: false,
  error: null,
  fetchCategories: async () => {},
  fetchFeaturedCategories: async () => {},
  fetchFeaturedProducts: async () => {},
  fetchProducts: async () => {},
  refreshProducts: async () => {},
  refreshCategories: async () => {},
  refreshFeaturedData: async () => {},
};

const DataContext = createContext<DataContextType>(defaultContextValue);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ categories: Category[] }>(
        "http://localhost:3000/api/products/categories",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setCategories(response.data.categories);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      setError("Failed to load categories. Please try again later.");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ featuredCategories: Category[] }>(
        "http://localhost:3000/api/products/featuredCategories",
        { withCredentials: true }
      );
      if (response.status === 200) {
        setFeaturedCategories(response.data.featuredCategories);
      }
    } catch (error) {
      setError("Failed to load featured categories");
      console.error("Error fetching featured categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ products: Product[] }>(
        "http://localhost:3000/api/products",
        { withCredentials: true }
      );
      if (response.status === 200) {
        setProducts(response.data.products);
      }
    } catch (error) {
      setError("Failed to load products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ featuredProducts: Product[] }>(
        "http://localhost:3000/api/products/featuredProducts",
        { withCredentials: true }
      );
      if (response.status === 200) {
        setFeaturedProducts(response.data.featuredProducts);
      }
    } catch (error) {
      setError("Failed to load featured products");
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  const refreshFeaturedData = async () => {
    await Promise.all([fetchFeaturedCategories(), fetchFeaturedProducts()]);
  };

  useEffect(() => {
    const abortController = new AbortController();

    const initialFetch = async () => {
      try {
        setLoading(true);
        const [
          categoriesRes,
          productsRes,
          featuredCategoriesRes,
          featuredProductsRes,
        ] = await Promise.all([
          axios.get<{ categories: Category[] }>(
            "http://localhost:3000/api/products/categories",
            { withCredentials: true, signal: abortController.signal }
          ),
          axios.get<{ products: Product[] }>(
            "http://localhost:3000/api/products",
            { withCredentials: true, signal: abortController.signal }
          ),
          axios.get<{ featuredCategories: Category[] }>(
            "http://localhost:3000/api/products/featuredCategories",
            { withCredentials: true, signal: abortController.signal }
          ),
          axios.get<{ featuredProducts: Product[] }>(
            "http://localhost:3000/api/products/featuredProducts",
            { withCredentials: true, signal: abortController.signal }
          ),
        ]);

        if (categoriesRes.status === 200) {
          setCategories(categoriesRes.data.categories);
        }
        if (productsRes.status === 200) {
          setProducts(productsRes.data.products);
        }
        if (featuredCategoriesRes.status === 200) {
          setFeaturedCategories(featuredCategoriesRes.data.featuredCategories);
        }
        if (featuredProductsRes.status === 200) {
          setFeaturedProducts(featuredProductsRes.data.featuredProducts);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setError("Failed to load initial data");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    initialFetch();
    return () => abortController.abort();
  }, []);

  const value: DataContextType = {
    categories,
    products,
    featuredCategories,
    featuredProducts,
    loading,
    error,
    fetchCategories,
    fetchProducts,
    fetchFeaturedCategories,
    fetchFeaturedProducts,
    refreshCategories,
    refreshProducts,
    refreshFeaturedData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default DataContext;
