import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
