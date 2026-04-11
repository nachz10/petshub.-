import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useCart } from "../../context/CartContext";

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "failure" | "pending"
  >("pending");
  const [message, setMessage] = useState<string>(
    "Verifying your payment, please wait..."
  );
  const [orderId, setOrderId] = useState<string | null>(null);
  const { dispatch } = useCart();

  useEffect(() => {
    const paymentData = searchParams.get("data");

    if (!paymentData) {
      setMessage("No payment data found. Invalid success URL.");
      setVerificationStatus("failure");
      setIsLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/checkout/esewa/verify?data=${encodeURIComponent(
            paymentData
          )}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setVerificationStatus("success");
          setMessage(
            response.data.message || "Payment successful and order confirmed!"
          );
          setOrderId(response.data.orderId);
          dispatch({ type: "CLEAR_CART" });
        } else {
          setVerificationStatus("failure");
          setMessage(
            response.data.message ||
              "Payment verification failed. Please contact support."
          );
          setOrderId(response.data.orderId);
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setVerificationStatus("failure");
        setMessage(
          error.response?.data?.message ||
            "An error occurred during payment verification. Please contact support."
        );
        if (error.response?.data?.orderId) {
          setOrderId(error.response.data.orderId);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, dispatch]);

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-700">{message}</p>
        </>
      ) : verificationStatus === "success" ? (
        <div className="text-center bg-green-50 p-10 rounded-lg shadow-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-700 mb-4">{message}</p>
          {orderId && (
            <p className="text-gray-600">
              Your Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <p className="text-gray-700 mt-2">
            You will receive an email confirmation shortly.
          </p>
          <Link
            to="/profile"
            className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
          >
            View Your Orders
          </Link>
          <Link
            to="/"
            className="mt-6 ml-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="text-center bg-red-50 p-10 rounded-lg shadow-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-700 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-700 mb-4">{message}</p>
          {orderId && (
            <p className="text-gray-600">
              Order ID (if available):{" "}
              <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <p className="text-gray-700 mt-2">
            If amount was debited, please contact support with your Order ID.
          </p>
          <Link
            to="/checkout"
            className="mt-6 inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="mt-6 ml-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
          >
            Go to Homepage
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
