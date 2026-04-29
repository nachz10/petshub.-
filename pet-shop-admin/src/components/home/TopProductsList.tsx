import React from "react";
import { TopSellingProduct } from "../../api/analytics";

interface TopProductsListProps {
  products: TopSellingProduct[];
}

const TopProductsList: React.FC<TopProductsListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return <p>No top selling products data available.</p>;
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
      <ul className="space-y-3">
        {products.map((product) => (
          <li key={product.productId} className="flex items-center space-x-3">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <p className="font-medium">{product.productName}</p>
              <p className="text-sm text-gray-500">
                Sold: {product.totalQuantitySold} units - Revenue: Rs.
                {Number(product.totalRevenueGenerated).toFixed(2)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProductsList;
