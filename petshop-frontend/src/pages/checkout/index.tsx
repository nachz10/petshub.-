import React, { useState, useEffect, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  availableUnits: number;
}

interface CheckoutItem  {
  // Inherits from CartItem, can add more if needed
}

interface DeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart(); // Assuming clearCart is available
  const { isAuthenticated } = useAuth();

  const [itemsToCheckout, setItemsToCheckout] = useState<CheckoutItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nepal",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    let checkoutSourceItems: any[] = [];
    if (location.state?.product && location.state?.quantity) {
      // Single item "Buy Now"
      const { product, quantity } = location.state as {
        product: Product;
        quantity: number;
      };
      checkoutSourceItems = [{ ...product, quantity }];
    } else if (cartState.items.length > 0) {
      // Checkout from cart
      checkoutSourceItems = cartState.items;
    } else {
      setError("No items to checkout. Your cart is empty.");
      // Optionally navigate away: navigate('/cart');
      return;
    }

    const validItems = checkoutSourceItems
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        id: item.id, // This is productId
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

    setItemsToCheckout(validItems);
  }, [
    location.state,
    cartState.items,
    isAuthenticated,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    const calculateTotal = () => {
      const total = itemsToCheckout.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalAmount(total);
    };
    calculateTotal();
  }, [itemsToCheckout]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (itemsToCheckout.some((item) => item.quantity <= 0)) {
      setError("One or more items have an invalid quantity.");
      setIsLoading(false);
      return;
    }

    // Basic validation for address
    if (
      !deliveryAddress.fullName ||
      !deliveryAddress.phone ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.zipCode ||
      !deliveryAddress.country
    ) {
      setError("Please fill in all delivery address fields.");
      setIsLoading(false);
      return;
    }

    const payload = {
      items: itemsToCheckout.map((item) => ({
        productId: item.id, // Ensure 'id' here is the product's ID
        quantity: item.quantity,
      })),
      deliveryAddress,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/checkout/initiate-payment",
        payload,
        {
          withCredentials: true,
        }
      );

      const { esewa_url, form_data } = response.data;

      // Create a form and submit it to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = esewa_url;

      Object.keys(form_data).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = form_data[key];
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      // User will be redirected to eSewa by the form submission
      // No need to setIsLoading(false) here as page will change
    } catch (err: any) {
      console.error("Error initiating payment:", err);
      setError(
        err.response?.data?.message ||
          "Failed to initiate payment. Please try again."
      );
      setIsLoading(false);
    }
  };

  if (error && itemsToCheckout.length === 0) {
    // Show general error if no items and error
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Items for Purchase</h2>
          {itemsToCheckout.length === 0 && !isLoading ? (
            <p>Your checkout is empty.</p>
          ) : (
            <div className="space-y-4">
              {itemsToCheckout.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-3 bg-white shadow rounded-lg"
                >
                  <img
                    src={item.imageUrl || "/api/placeholder/80/80"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    NPR {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <form onSubmit={handleSubmitOrder}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName" 
                  placeholder="Full Name*"
                  value={deliveryAddress.fullName}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number*"
                  value={deliveryAddress.phone}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full"
                  required
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address*"
                  value={deliveryAddress.street}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full md:col-span-2"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City*"
                  value={deliveryAddress.city}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State/Province*"
                  value={deliveryAddress.state}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip/Postal Code*"
                  value={deliveryAddress.zipCode}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full"
                  required
                />
                <select
                  name="country"
                  value={deliveryAddress.country}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full"
                  required
                >
                  <option value="Nepal">Nepal</option>
                  {/* Add other countries if needed */}
                </select>
              </div>
              {/* Submit button is part of the summary or outside */}
            </form>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>NPR {totalAmount.toFixed(2)}</span>
              </div>
              {/* Add Tax, Shipping if applicable from backend later */}
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>NPR {totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleSubmitOrder}
              disabled={isLoading || itemsToCheckout.length === 0}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Proceed to eSewa Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
