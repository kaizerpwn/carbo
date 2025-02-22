"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { AuthAPI } from "@/lib/Auth/Auth";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await AuthAPI.loginUser(formData);
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-backgroundDark flex flex-col">
      <div className="h-2 bg-primaryColor rounded-b-lg" />

      <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
        <div className="flex items-center gap-3 mb-12 mt-8">
          <div className="w-12 h-12 rounded-full bg-primaryColor flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6Z" />
              <path d="M12 16C9.33 16 4 17.34 4 20V22H20V20C20 17.34 14.67 16 12 16Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Welcome back</h1>
            <p className="text-[#6B7280] text-sm">Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-white text-sm font-medium block"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-backgroundLight rounded-xl px-4 py-3 text-white border border-[#404040] focus:border-primaryColor focus:outline-none transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-white text-sm font-medium block"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-backgroundLight rounded-xl px-4 py-3 text-white border border-[#404040] focus:border-primaryColor focus:outline-none transition-colors pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-primaryColor text-sm hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-primaryColor text-white py-3 rounded-xl font-medium hover:bg-[#3aa568] transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Sign In
          </button>

          <p className="text-center text-[#6B7280] text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-primaryColor hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
