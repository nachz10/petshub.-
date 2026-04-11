import React from "react";

const ProductCard = ({
  image,
  name,
  price,
  discount,
  rating,
  onClick,
}: {
  image: string;
  name: string;
  price: string;
  discount: string;
  rating: number;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden w-64 hover:shadow-blue-400 transition-shadow duration-300 cursor-pointer"
    >
      <img src={image} alt={name} className="w-full h-64 object-cover" />
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="text-yellow-400">
            {"★".repeat(Math.floor(rating)) +
              "☆".repeat(5 - Math.floor(rating))}
          </span>
          <span className="text-gray-500 text-sm ml-2">
            ({rating.toFixed(1)})
          </span>
        </div>
        <h2 className="text-lg font-semibold mb-2">{name}</h2>
        <p className="text-xl font-bold text-gray-800 mb-1">{price}</p>
        <p className="text-sm text-green-600">{discount}</p>
      </div>
    </div>
  );
};

export default ProductCard;
