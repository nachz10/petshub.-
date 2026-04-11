import { ShoppingBag, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-8">
        <div className="flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <ShoppingBag className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Oops! Something went wrong
          </h1>
          <p className="mt-2 text-base text-gray-500">
            We're sorry, but we couldn't process your request. Our team has been
            notified and is working on a fix.
          </p>
          {countdown > 0 && (
            <p className="mt-1 text-sm text-gray-400">
              Auto-redirecting to homepage in {countdown} seconds...
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            type="button"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to homepage
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>Need help? Contact our customer support</p>
          <a
            href="mailto:support@yourstore.com"
            className="text-indigo-600 hover:text-indigo-500"
          >
            support@yourstore.com
          </a>
        </div>

        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Error code: 404
          </span>
        </div>
      </div>
    </div>
  );
}
