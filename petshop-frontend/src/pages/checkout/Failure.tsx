import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentFailurePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center bg-red-50 p-10 rounded-lg shadow-md">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-700 mb-2">
          Payment Failed or Cancelled
        </h1>
        <p className="text-gray-700 mb-4">
          Unfortunately, your payment could not be processed or was cancelled.
        </p>
        {orderId && (
          <p className="text-gray-600">
            Reference Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        )}
        <p className="text-gray-700 mt-2">
          No amount has been debited from your account for this attempt. If you
          believe this is an error, please contact our support.
        </p>
        <div className="mt-8 space-x-4">
          <Link
            to="/checkout"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-150"
          >
            Try Payment Again
          </Link>
          <Link
            to="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-150"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
