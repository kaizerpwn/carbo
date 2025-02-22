"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthAPI } from "@/lib/Auth/Auth";

interface AuthContextProps {
  onboardingData: any;
  setOnboardingData: (data: any) => void;
  signupData: any;
  setSignupData: (data: any) => void;
  user: any;
  setUser: (user: any) => void;
  loginUser: (values: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [onboardingData, setOnboardingData] = useState({});
  const [signupData, setSignupData] = useState({});
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const loginUser = async (values: { email: string; password: string }) => {
    try {
      const response = await AuthAPI.loginUser(values);
      if (!user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        onboardingData,
        setOnboardingData,
        signupData,
        setSignupData,
        user,
        setUser,
        loginUser,
        logout,
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
