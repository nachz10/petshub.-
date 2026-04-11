import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  const paymentDetails = {
    transactionId: "ES123456789",
    amount: "Rs. 1,500.00",
    date: new Date().toLocaleString(),
    service: "Premium Subscription",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 bg-green-600 sm:px-12 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-white" />
            <h1 className="mt-4 text-3xl font-bold text-white">
              Payment Successful!
            </h1>
            <p className="mt-2 text-green-100">Thank you for your purchase</p>
          </div>

          <div className="px-6 py-8 sm:px-12">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Confirmation
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your payment has been processed successfully. A confirmation
                  email has been sent to your registered email address.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Payment Details
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 text-sm">
                  <div className="space-y-2">
                    <dt className="text-gray-500">Transaction ID</dt>
                    <dd className="font-medium text-gray-900">
                      {paymentDetails.transactionId}
                    </dd>
                  </div>
                  <div className="space-y-2">
                    <dt className="text-gray-500">Date & Time</dt>
                    <dd className="font-medium text-gray-900">
                      {paymentDetails.date}
                    </dd>
                  </div>
                  <div className="space-y-2">
                    <dt className="text-gray-500">Amount Paid</dt>
                    <dd className="font-medium text-gray-900">
                      {paymentDetails.amount}
                    </dd>
                  </div>
                  <div className="space-y-2">
                    <dt className="text-gray-500">Service</dt>
                    <dd className="font-medium text-gray-900">
                      {paymentDetails.service}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Your account will be upgraded within the next 5 minutes.
                      If you experience any issues, please contact our support
                      team.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
