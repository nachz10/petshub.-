import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signupWithVerification: (
    fullName: string,
    email: string,
    password: string,
    verificationCode: string
  ) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/signup",
        { fullName, email, password },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  };

  const signupWithVerification = async (
    fullName: string,
    email: string,
    password: string,
    verificationCode: string
  ) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/verify-and-signup",
        {
          fullName,
          email,
          password,
          code: verificationCode,
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.delete("http://localhost:3000/api/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        signup,
        signupWithVerification,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
