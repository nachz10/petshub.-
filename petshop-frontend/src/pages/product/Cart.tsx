import { X, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartOverlay = ({ isOpen, onClose }: CartOverlayProps) => {
  const navigate = useNavigate();
  const { state, removeFromCart, updateQuantity } = useCart();
  const { items, isLoading, error } = state;

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      await updateQuantity(id, newQuantity);
    } else {
      await removeFromCart(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              <h2 className="text-xl font-semibold">
                Your Cart ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-6">Your cart is empty</p>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/");
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b last:border-b-0"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">
                      ${item.price} each
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-3 min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${calculateTotal()}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold">${calculateTotal()}</span>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={onClose}
                  className="cursor-pointer w-full py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/checkout");
                  }}
                  className="cursor-pointer w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;
