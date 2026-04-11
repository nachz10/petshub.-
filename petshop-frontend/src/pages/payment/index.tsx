import { useState, useEffect } from "react";
import {
  User,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "../../utils/generate-esewa-signature";

const checkoutSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  failure_url: z.string(),
  product_delivery_charge: z.string(),
  product_service_charge: z.string(),
  product_code: z.string(),
  signature: z.string(),
  signed_field_names: z.string(),
  success_url: z.string(),
  tax_amount: z.string(),
  total_amount: z.string(),
  transaction_uuid: z.string(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: cartState } = useCart();
  const { isAuthenticated } = useAuth();
  const [purchaseType, setPurchaseType] = useState<"cart" | "single">("cart");
  const [singleProduct, setSingleProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      failure_url: "http://localhost:5173/payment/failed",
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: "i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=",
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: "http://localhost:5173/payment/success",
      tax_amount: "0",
      total_amount: "0",
      transaction_uuid: uuidv4(),
    },
  });

  useEffect(() => {
    if (location.state?.product) {
      setPurchaseType("single");
      setSingleProduct({
        ...location.state.product,
        quantity: location.state.quantity || 1,
      });
      const total =
        location.state.product.price * (location.state.quantity || 1) + 15.0;
      setValue("total_amount", total.toFixed(2));
    } else {
      setPurchaseType("cart");
      const cartTotal =
        cartState.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ) + 15.0;
      setValue("total_amount", cartTotal.toFixed(2));
    }
  }, [location, cartState.items, setValue]);

  const displayItems =
    purchaseType === "single" && singleProduct
      ? [
          {
            id: singleProduct.id,
            name: singleProduct.name,
            price: singleProduct.price,
            quantity: singleProduct.quantity,
            imageUrl: singleProduct.imageUrl,
          },
        ]
      : cartState.items;

  const subtotal = displayItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 15.0;
  const total = subtotal + shipping;

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated) {
      setError("Please log in to complete your purchase");
      setLoading(false);
      return;
    }

    try {
      const signature = generateEsewaSignature({
        total_amount: data.total_amount,
        transaction_uuid: data.transaction_uuid,
        product_code: data.product_code,
      });
      let response;
      const orderData = {
        deliveryAddress: data.address,
        paymentMethod: "esewa",
        contactInfo: {
          name: data.fullName,
          phone: data.phoneNumber,
        },
        esewaData: {
          failure_url: data.failure_url,
          product_delivery_charge: data.product_delivery_charge,
          product_service_charge: data.product_service_charge,
          product_code: data.product_code,
          signature: signature,
          signed_field_names: data.signed_field_names,
          success_url: data.success_url,
          tax_amount: data.tax_amount,
          total_amount: data.total_amount,
          transaction_uuid: data.transaction_uuid,
        },
      };

      if (purchaseType === "single" && singleProduct) {
        response = await axios.post(
          "http://localhost:3000/api/orders/product",
          {
            ...orderData,
            productId: singleProduct.id,
            quantity: singleProduct.quantity,
          },
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/api/orders/cart",
          orderData,
          { withCredentials: true }
        );
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const params = {
        amount: data.total_amount,
        tax_amount: data.tax_amount,
        total_amount: data.total_amount,
        transaction_uuid: data.transaction_uuid,
        product_code: data.product_code,
        product_service_charge: data.product_service_charge,
        product_delivery_charge: data.product_delivery_charge,
        success_url: data.success_url,
        failure_url: data.failure_url,
        signed_field_names: data.signed_field_names,
        signature: signature,
        secret: "8gBm/:&EnhH.1/q",
      };
      console.log("Form params:", params);

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(
        err.response?.data?.message || "An error occurred during checkout"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>

        {/* Purchase type indicator */}
        <div className="mb-6 flex items-center gap-2">
          {purchaseType === "cart" ? (
            <>
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Checking out from your cart</span>
            </>
          ) : (
            <>
              <span className="text-gray-600">Direct product purchase</span>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Order Summary
                {purchaseType === "cart" && `(${displayItems.length} items)`}
              </h2>

              <div className="space-y-4 mb-8">
                {displayItems.map((item, index) => (
                  <div
                    key={purchaseType === "cart" ? item.id : index}
                    className="flex gap-4 py-4 border-b last:border-b-0"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm mb-2">
                        ${item.price} each
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        {purchaseType === "single" && (
                          <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Direct Purchase
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Estimated delivery time: 3-5 business days
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Contact Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <Controller
                      name="fullName"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          id="fullName"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ram Bista"
                        />
                      )}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="tel"
                          id="phoneNumber"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="98XXXXXXXX"
                        />
                      )}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          id="address"
                          rows={3}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full delivery address"
                        />
                      )}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* Hidden eSewa fields */}
                <Controller
                  name="failure_url"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="product_delivery_charge"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="product_service_charge"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="product_code"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="signature"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="signed_field_names"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="success_url"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="tax_amount"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="total_amount"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="transaction_uuid"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
                      loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    } transition-colors flex justify-center items-center`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {control._formValues.paymentMethod === "esewa"
                          ? "Pay with eSewa"
                          : "Place Order"}
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                  <p>
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
