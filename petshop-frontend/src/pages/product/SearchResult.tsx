import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../home/components/Product";
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Dog,
  Cat,
  Bird,
  Fish,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductType {
  id: string;
  name: string;
}

interface AnimalType {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  availableUnits: number;
  freeShipping: boolean;
  returnPolicy: boolean;
  category: Category;
  productType: ProductType;
  averageRating: number;
  totalReviews: number;
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
  animalTargets?: { animalType: AnimalType }[];
  attributes?: { name: string; value: string }[];
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const query = searchParams.get("query") || "";
  const categoryFilter = searchParams.get("category") || "";
  const animalFilter = searchParams.get("animal") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const sortBy = searchParams.get("sort") || "relevance";
  const inStockOnly = searchParams.get("inStock") === "true";
  const freeShippingOnly = searchParams.get("freeShipping") === "true";
  const withReturnPolicy = searchParams.get("returnPolicy") === "true";

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        setProducts([]);
        setFilteredProducts([]);

        if (!query.trim() && !categoryFilter && !animalFilter) {
          const response = await axios.get(
            `http://localhost:3000/api/products`,
            {
              withCredentials: true,
            }
          );
          setProducts(response.data.products);
        } else {
          let searchUrl = `http://localhost:3000/api/products/search?query=${encodeURIComponent(
            query
          )}`;

          const response = await axios.get(searchUrl, {
            withCredentials: true,
          });

          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to load search results. Please try again later.");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get(
          "http://localhost:3000/api/products/categories",
          {
            withCredentials: true,
          }
        );
        setCategories(categoriesResponse.data.categories);

        const animalTypesResponse = await axios.get(
          "http://localhost:3000/api/admin/animal-types",
          {
            withCredentials: true,
          }
        );
        setAnimalTypes(animalTypesResponse.data.animalTypes);

        const productTypesResponse = await axios.get(
          "http://localhost:3000/api/admin/product-types",
          {
            withCredentials: true,
          }
        );
        setProductTypes(productTypesResponse.data.productTypes);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];

      if (categoryFilter) {
        filtered = filtered.filter(
          (product) => product.category.id === categoryFilter
        );
      }

      if (animalFilter) {
        filtered = filtered.filter((product) =>
          product.animalTargets?.some(
            (target) => target.animalType.id === animalFilter
          )
        );
      }

      if (priceMin) {
        filtered = filtered.filter(
          (product) => product.price >= parseFloat(priceMin)
        );
      }

      if (priceMax) {
        filtered = filtered.filter(
          (product) => product.price <= parseFloat(priceMax)
        );
      }

      if (inStockOnly) {
        filtered = filtered.filter((product) => product.availableUnits > 0);
      }

      if (freeShippingOnly) {
        filtered = filtered.filter((product) => product.freeShipping);
      }

      if (withReturnPolicy) {
        filtered = filtered.filter((product) => product.returnPolicy);
      }

      switch (sortBy) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [
    products,
    categoryFilter,
    animalFilter,
    priceMin,
    priceMax,
    sortBy,
    inStockOnly,
    freeShippingOnly,
    withReturnPolicy,
  ]);

  const updateFilters = (filterName: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (value === "" || value === null) {
      newSearchParams.delete(filterName);
    } else {
      newSearchParams.set(filterName, value);
    }

    setSearchParams(newSearchParams);
  };

  const toggleBooleanFilter = (filterName: string, currentValue: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (currentValue) {
      newSearchParams.delete(filterName);
    } else {
      newSearchParams.set(filterName, "true");
    }

    setSearchParams(newSearchParams);
  };

  const resetFilters = () => {
    const newSearchParams = new URLSearchParams();
    if (query) {
      newSearchParams.set("query", query);
    }
    setSearchParams(newSearchParams);
  };

  const getAnimalIcon = (animalName: string) => {
    const name = animalName.toLowerCase();
    if (name.includes("dog")) return <Dog size={16} />;
    if (name.includes("cat")) return <Cat size={16} />;
    if (name.includes("bird")) return <Bird size={16} />;
    if (name.includes("fish")) return <Fish size={16} />;
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {query ? `Search Results for "${query}"` : "All Products"}
        </h1>
        <div className="flex items-center mt-2 text-gray-600">
          <span>{filteredProducts.length} products found</span>

          <div className="flex flex-wrap gap-2 ml-4">
            {categoryFilter &&
              categories.find((c) => c.id === categoryFilter) && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  {categories.find((c) => c.id === categoryFilter)?.name}
                  <button
                    onClick={() => updateFilters("category", "")}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

            {animalFilter && animalTypes.find((a) => a.id === animalFilter) && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                {animalTypes.find((a) => a.id === animalFilter)?.name}
                <button
                  onClick={() => updateFilters("animal", "")}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {(priceMin || priceMax) && (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                {priceMin && priceMax
                  ? `$${priceMin} - $${priceMax}`
                  : priceMin
                  ? `Min $${priceMin}`
                  : `Max $${priceMax}`}
                <button
                  onClick={() => {
                    updateFilters("priceMin", "");
                    updateFilters("priceMax", "");
                  }}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                In Stock
                <button
                  onClick={() => toggleBooleanFilter("inStock", true)}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {freeShippingOnly && (
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                Free Shipping
                <button
                  onClick={() => toggleBooleanFilter("freeShipping", true)}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {withReturnPolicy && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                Return Policy
                <button
                  onClick={() => toggleBooleanFilter("returnPolicy", true)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {(categoryFilter ||
              animalFilter ||
              priceMin ||
              priceMax ||
              inStockOnly ||
              freeShippingOnly ||
              withReturnPolicy) && (
              <button
                onClick={() => resetFilters()}
                className="text-xs text-gray-600 hover:text-gray-800 underline ml-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => updateFilters("category", e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>

            <div className="relative">
              <select
                value={animalFilter}
                onChange={(e) => updateFilters("animal", e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Animals</option>
                {animalTypes.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={priceMin}
                onChange={(e) => updateFilters("priceMin", e.target.value)}
                className="w-20 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max $"
                value={priceMax}
                onChange={(e) => updateFilters("priceMax", e.target.value)}
                className="w-20 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={() => toggleBooleanFilter("inStock", inStockOnly)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                In Stock
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeShippingOnly}
                  onChange={() =>
                    toggleBooleanFilter("freeShipping", freeShippingOnly)
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Free Shipping
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={withReturnPolicy}
                  onChange={() =>
                    toggleBooleanFilter("returnPolicy", withReturnPolicy)
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Return Policy
              </label>
            </div>
          </div>

          <div className="relative ml-auto">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => updateFilters("sort", e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="md:hidden mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Filters</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => updateFilters("category", e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Animal Type
              </label>
              <select
                value={animalFilter}
                onChange={(e) => updateFilters("animal", e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Animals</option>
                {animalTypes.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={priceMin}
                  onChange={(e) => updateFilters("priceMin", e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={priceMax}
                  onChange={(e) => updateFilters("priceMax", e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={() => toggleBooleanFilter("inStock", inStockOnly)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                In Stock
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeShippingOnly}
                  onChange={() =>
                    toggleBooleanFilter("freeShipping", freeShippingOnly)
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Free Shipping
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={withReturnPolicy}
                  onChange={() =>
                    toggleBooleanFilter("returnPolicy", withReturnPolicy)
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Return Policy
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>

              <button
                onClick={() => resetFilters()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            No products found
          </h2>
          <p className="mt-2 text-gray-500">
            {query
              ? `We couldn't find any products matching "${query}"`
              : "No products match the selected filters"}
          </p>
          <button
            onClick={() => resetFilters()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <ProductCard key={product.id} product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
