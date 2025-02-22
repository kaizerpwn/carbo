"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextProps {
  onboardingData: any;
  setOnboardingData: (data: any) => void;
  signupData: any;
  setSignupData: (data: any) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [onboardingData, setOnboardingData] = useState({});
  const [signupData, setSignupData] = useState({});

  return (
    <AuthContext.Provider
      value={{ onboardingData, setOnboardingData, signupData, setSignupData }}
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
