import React from "react";
import { useAuth } from "./context/authContext";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes";

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 ml-[280px] p-6">
            <AppRoutes />
          </div>
        </div>
      ) : (
        <AppRoutes />
      )}
    </>
  );
};

export default App;
