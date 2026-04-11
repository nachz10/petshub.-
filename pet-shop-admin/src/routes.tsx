import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";
import Logout from "./pages/Logout";
import Categories from "./pages/Categories";
import AdminLogin from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import SupportAdminPanel from "./pages/Support";
import ProductTypes from "./pages/ProductTypes";
import AnimalTypes from "./pages/AnimalTypes";
import Veterinarians from "./pages/Veterinarians";
import NewProductsPage from "./pages/NewProductPage";
import Appointments from "./pages/Appointments";
import AdminOrdersPage from "./pages/OrdersPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AdminOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <NewProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product-types"
        element={
          <ProtectedRoute>
            <ProductTypes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/animal-types"
        element={
          <ProtectedRoute>
            <AnimalTypes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/veterinarians"
        element={
          <ProtectedRoute>
            <Veterinarians />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <SupportAdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
