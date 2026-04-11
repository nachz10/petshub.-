import React from "react";
import { useNavigate } from "react-router-dom";
import { type Product } from "../../../context/DataContext";
import { StarRatingDisplay } from "../../../components/StarRatingDisplay";

type ProductCardProps = {
  product: Product;
};

const base_api_url = import.meta.env.VITE_BASE_API_URL;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const primaryImage = product.images.find((image) => image.isPrimary);
  const primaryImageUrl = `${base_api_url}${primaryImage?.url}`;

  return (
    <div
      className="w-full max-w-[250px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer border border-gray-200 hover:border-amazon_primary"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <img
          src={primaryImageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300?text=No+Image";
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm md:text-base hover:text-amazon_primary">
          {product.name}
        </h3>

        <div className="mt-1">
          {product.averageRating && product.averageRating > 0 ? (
            <StarRatingDisplay
              rating={product.averageRating}
              totalReviews={product.totalReviews}
              size={14}
            />
          ) : (
            <span className="text-xs text-gray-500">No ratings yet</span>
          )}
        </div>

        <div className="flex items-center mt-auto pt-2">
          <span className="font-bold text-amazon_price text-lg">
            Rs. {Number(product.price).toFixed(2)}
          </span>
        </div>

        <span className="text-xs text-amazon_primary font-semibold mt-1">
          FREE Delivery
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
