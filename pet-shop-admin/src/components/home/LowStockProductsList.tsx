import React from "react";
import { LowStockProduct } from "../../api/analytics";

interface LowStockProductsListProps {
  products: LowStockProduct[];
}

const LowStockProductsList: React.FC<LowStockProductsListProps> = ({
  products,
}) => {
  if (!products || products.length === 0) {
    return (
      <p className="text-gray-500">No products are currently low in stock.</p>
    );
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-orange-600">
        Low Stock Products
      </h2>
      <ul className="space-y-3">
        {products.map((product) => (
          <li key={product.id} className="flex items-center space-x-3">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-red-500">
                Only {product.availableUnits} units left!
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockProductsList;
