import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/home/Home";
import ProductDetailPage from "../pages/product/ProductDetail";
import ProductList from "../pages/product/ProductList";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import SearchResults from "../pages/product/SearchResult";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import AppointmentBookingPage from "../pages/appointment";
import ProfilePage from "../pages/profile";
import ProtectedRoute from "./ProtectedRoute";
import PaymentFailed from "../pages/payment/FailedPayment";
import PaymentSuccess from "../pages/payment/SuccessfulPayment";
import CheckoutPage from "../pages/checkout";
import PaymentSuccessPage from "../pages/checkout/Success";
import PaymentFailurePage from "../pages/checkout/Failure";
import AboutUsPage from "../pages/profile/About";
import DeliveryOptionsPage from "../pages/DeliveryOptions";
import PrivacyPolicyPage from "../pages/PrivacyPolicy";
import FAQPage from "../pages/Faq";
import ContactUsPage from "../pages/Contact";
import { fetchNavCategories } from "../services/categoryService";
import ErrorPage from "../pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: fetchNavCategories,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products/categories/:id",
        element: <ProductList />,
      },
      {
        path: "/products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      },

      {
        path: "/about",
        element: <AboutUsPage />,
      },
      {
        path: "/delivery",
        element: <DeliveryOptionsPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/faq",
        element: <FAQPage />,
      },
      {
        path: "/contact",
        element: <ContactUsPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/checkout",
            element: <CheckoutPage />,
          },
          {
            path: "/bookAppointment",
            element: <AppointmentBookingPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/payment/success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment/failed",
    element: <PaymentFailed />,
  },
  {
    path: "/payment-success",
    element: <PaymentSuccessPage />,
  },
  {
    path: "/payment-failure",
    element: <PaymentFailurePage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
]);
