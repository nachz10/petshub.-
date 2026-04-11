import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../home/components/Product";
import { type Product } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const { id: categoryId } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCategoryRelatedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/products/categories/${categoryId}`,
          {
            withCredentials: true,
            signal: abortController.signal,
          }
        );

        if (response.status === 200) {
          setProducts(response.data.products);
          setCategoryName(response.data.categoryName || "");
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error fetching categories:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryRelatedProducts();
    return () => {
      abortController.abort();
    };
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-10">Loading products...</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg h-80 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {categoryName
            ? `No products in ${categoryName}`
            : "No products found"}
        </h1>
        <p className="text-gray-600 mb-6">
          There are currently no products available in this category.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-amazon_primary text-white rounded hover:bg-amazon_primary_dark"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {products && products.length > 0 && (
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-blue-600"
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span
            onClick={() => navigate(`/products/categories/${categoryId}`)}
            className="cursor-pointer hover:text-blue-600"
          >
            {products[0].category.name}
          </span>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-10">
        {categoryName || "Available Products"}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
