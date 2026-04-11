import { useState, useEffect } from "react";
import {
  CheckCircle,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import ProductReviewsSection from "./components/ProductReviewSection";
import { StarRatingDisplay } from "../../components/StarRatingDisplay";

export const base_api_url = import.meta.env.VITE_BASE_API_URL;

type AnimalType = {
  id: string;
  name: string;
};

type ProductAnimalTarget = {
  id: string;
  animalTypeId: string;
  animalType: AnimalType;
};

type ProductAttribute = {
  id: string;
  name: string;
  value: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  availableUnits: number;
  freeShipping: boolean;
  returnPolicy: boolean;
  category: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
  productType: {
    id: string;
    name: string;
    attributes: {
      id: string;
      name: string;
      description: string;
      isRequired: boolean;
    }[];
  };
  animalTargets: ProductAnimalTarget[];
  attributes: ProductAttribute[];
  policies: {
    id: string;
    policyType: string;
    description: string;
    duration: number;
  }[];
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
  averageRating: number;
  totalReviews: number;
};

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "description"
  );
  const [cartFeedback, setCartFeedback] = useState({
    show: false,
    message: "",
  });

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get<{ product: ProductDetailData }>(
          `http://localhost:3000/api/products/${id}`,
          { withCredentials: true }
        );
        setProduct(response.data.product);
      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleReviewUpdate = (updatedProductData: ProductDetailData) => {
    setProduct(updatedProductData);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product, quantity);

      setCartFeedback({
        show: true,
        message: `${product.name} added to your cart!`,
      });

      setTimeout(() => {
        setCartFeedback({ show: false, message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setCartFeedback({
        show: true,
        message: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.availableUnits) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const getAllProductImages = () => {
    if (!product) return [];
    return [...product.images.map((img) => `${base_api_url}${img?.url}`)];
  };

  const selectImage = (index: number) => {
    setSelectedImage(index);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md text-center">
          {error}
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg max-w-md text-center">
          Product not found
        </div>
      </div>
    );

  const images = getAllProductImages();
  const image =
    product.images.find((img) => img.isPrimary) || product.images[0];
  const imageUrl = `${base_api_url}${image.url}`;

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-blue-600"
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span
            onClick={() =>
              navigate(`/products/categories/${product.category.id}`)
            }
            className="cursor-pointer hover:text-blue-600"
          >
            {product.category.name}
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        {cartFeedback.show && (
          <div className="fixed top-6 right-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <p>{cartFeedback.message}</p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Image Gallery Section */}
              <div className="w-full lg:w-1/2">
                <div className="mb-4">
                  <div className="aspect-square overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={images[selectedImage]}
                      alt={`${product.name} - View ${selectedImage + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`aspect-square border-2 rounded-lg cursor-pointer transition-all ${
                        selectedImage === index
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover object-center rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details Section */}
              <div className="w-full lg:w-1/2">
                {/* Category Badge */}
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category.name}
                  </span>
                  {product.productType && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 ml-2">
                      {product.productType.name}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center mb-4">
                  <StarRatingDisplay
                    rating={product.averageRating}
                    totalReviews={product.totalReviews}
                    size={20}
                  />
                </div>

                <div className="flex items-center mb-6">
                  <p className="text-3xl font-bold text-red-600">
                    Rs. {product.price}
                  </p>
                </div>

                {/* Availability */}
                {product.availableUnits > 0 ? (
                  <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-6">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>
                      In Stock - {product.availableUnits} units available
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-lg mb-6">
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}

                {/* Animal Target */}
                {product.animalTargets && product.animalTargets.length > 0 && (
                  <div className="mb-6">
                    <p className="text-gray-700 mb-2">Suitable for:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.animalTargets.map((target) => (
                        <span
                          key={target.id}
                          className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {target.animalType.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Attributes */}
                {product.attributes && product.attributes.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      {product.attributes.map((attr) => (
                        <div key={attr.id} className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            {attr.name}
                          </span>
                          <span className="text-gray-800 font-medium">
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <hr className="border-gray-200 my-6" />

                {/* Quantity Selector */}
                <div className="flex items-center mb-6">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={handleDecreaseQuantity}
                      disabled={quantity <= 1}
                      className={`px-4 py-2 bg-gray-100 ${
                        quantity > 1
                          ? "hover:bg-gray-200 text-gray-800"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-medium text-center w-16">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncreaseQuantity}
                      disabled={product.availableUnits <= quantity}
                      className={`px-4 py-2 bg-gray-100 ${
                        product.availableUnits > quantity
                          ? "hover:bg-gray-200 text-gray-800"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.availableUnits <= 0}
                  className={`w-full py-4 px-6 rounded-xl mb-4 flex items-center justify-center transition-colors ${
                    product.availableUnits > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {addingToCart ? (
                    <span className="flex items-center">
                      <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Adding to Cart...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!product) return;
                    navigate("/checkout", {
                      state: {
                        product: {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          imageUrl: imageUrl,
                          availableUnits: product.availableUnits,
                        },
                        quantity: quantity,
                      },
                    });
                  }}
                  disabled={product.availableUnits <= 0}
                  className={`w-full py-4 px-6 rounded-xl mb-6 transition-colors ${
                    product.availableUnits > 0
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Buy Now
                </button>

                {/* Shipping & Returns Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-green-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Fast Delivery All Over Nepal
                      </p>
                      <p className="text-sm text-gray-600">
                        24/7 delivery within 4 days
                      </p>
                    </div>
                  </div>

                  {product.freeShipping && (
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Free Shipping
                        </p>
                        <p className="text-sm text-gray-600">On all orders</p>
                      </div>
                    </div>
                  )}

                  {product.returnPolicy && (
                    <div className="flex items-start">
                      <RotateCcw className="h-5 w-5 text-green-600 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.policies?.find(
                            (p) => p.policyType === "return"
                          )?.duration || 30}
                          -Day Returns
                        </p>
                        <p className="text-sm text-gray-600">
                          Easy returns if you change your mind
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Secure Payments
                      </p>
                      <p className="text-sm text-gray-600">
                        Multiple payment options available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Collapsible Sections */}
          <div className="bg-white rounded-2xl shadow-sm p-1 mb-8">
            {/* Description Section */}
            <div className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleSection("description")}
                className="flex justify-between items-center w-full p-5 text-left"
              >
                <span className="text-lg font-medium text-gray-900">
                  Product Description
                </span>
                {expandedSection === "description" ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedSection === "description" && (
                <div className="px-5 pb-5">
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Features Section */}
            <div className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleSection("features")}
                className="flex justify-between items-center w-full p-5 text-left"
              >
                <span className="text-lg font-medium text-gray-900">
                  Features & Specifications
                </span>
                {expandedSection === "features" ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedSection === "features" && (
                <div className="px-5 pb-5">
                  <div className="grid md:grid-cols-2 gap-6">
                    {product.productType &&
                      product.productType.attributes &&
                      product.productType.attributes.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">
                            Product Type Attributes
                          </h4>
                          <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {product.productType.attributes.map((attr) => (
                              <li key={attr.id}>
                                <span className="font-medium">{attr.name}</span>
                                {attr.description && (
                                  <span>: {attr.description}</span>
                                )}
                                {attr.isRequired && (
                                  <span className="text-red-500 ml-1">
                                    (Required)
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery & Returns Policy */}
            <div className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleSection("shipping")}
                className="flex justify-between items-center w-full p-5 text-left"
              >
                <span className="text-lg font-medium text-gray-900">
                  Shipping & Returns
                </span>
                {expandedSection === "shipping" ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedSection === "shipping" && (
                <div className="px-5 pb-5">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Truck className="h-5 w-5 mr-2" /> Shipping Policy
                      </h4>
                      <p className="text-gray-700">
                        We deliver all over Nepal 24/7 within 4 days. All orders
                        are processed and shipped within 24 hours on business
                        days.
                      </p>
                      {product.freeShipping && (
                        <p className="text-green-600 font-medium mt-2">
                          This product qualifies for FREE shipping!
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <RotateCcw className="h-5 w-5 mr-2" /> Return Policy
                      </h4>
                      {product.returnPolicy ? (
                        <div>
                          <p className="text-gray-700">
                            This product can be returned within{" "}
                            <span className="font-medium">
                              {product.policies?.find(
                                (p) => p.policyType === "return"
                              )?.duration || 30}{" "}
                              days
                            </span>{" "}
                            of delivery for a full refund.
                          </p>
                          {product.policies?.find(
                            (p) => p.policyType === "return"
                          )?.description && (
                            <p className="text-gray-700 mt-2">
                              {
                                product.policies.find(
                                  (p) => p.policyType === "return"
                                )?.description
                              }
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-700">
                          This product is not eligible for returns.
                        </p>
                      )}
                    </div>

                    {product.policies &&
                      product.policies.filter((p) => p.policyType !== "return")
                        .length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <Shield className="h-5 w-5 mr-2" /> Other Policies
                          </h4>
                          <ul className="space-y-2 text-gray-700">
                            {product.policies
                              .filter((p) => p.policyType !== "return")
                              .map((policy) => (
                                <li
                                  key={policy.id}
                                  className="flex items-start"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <div>
                                    <span className="font-medium capitalize">
                                      {policy.policyType}
                                    </span>
                                    {policy.duration && (
                                      <span> ({policy.duration} days)</span>
                                    )}
                                    : {policy.description}
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
            <ProductReviewsSection
              product={product}
              currentUserFullName={user?.fullName}
              onReviewSubmitted={handleReviewUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
