import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  const errorDetails = {
    errorCode: "PAYMENT_DECLINED",
    amount: "Rs. 1,500.00",
    service: "Premium Subscription",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 bg-red-600 sm:px-12 text-center">
            <TriangleAlert className="mx-auto h-16 w-16 text-white" />
            <h1 className="mt-4 text-3xl font-bold text-white">
              Payment Failed
            </h1>
            <p className="mt-2 text-red-100">
              We couldn't process your payment
            </p>
          </div>

          <div className="px-6 py-8 sm:px-12">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Transaction Not Completed
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your payment was not processed successfully. Please try again
                  or use a different payment method.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Error Details
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 text-sm">
                  <div className="space-y-2">
                    <dt className="text-gray-500">Error Code</dt>
                    <dd className="font-medium text-gray-900">
                      {errorDetails.errorCode}
                    </dd>
                  </div>
                  <div className="space-y-2">
                    <dt className="text-gray-500">Amount</dt>
                    <dd className="font-medium text-gray-900">
                      {errorDetails.amount}
                    </dd>
                  </div>
                  <div className="space-y-2">
                    <dt className="text-gray-500">Service</dt>
                    <dd className="font-medium text-gray-900">
                      {errorDetails.service}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <TriangleAlert className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      No amount has been deducted from your account. If you see
                      any deduction, it will be refunded automatically within
                      3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/checkout")}
                className="rounded-md bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try Payment Again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-md bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300"
              >
                Go to Dashboard
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Need help?{" "}
                <a
                  href="/contact"
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  Contact our support team
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
