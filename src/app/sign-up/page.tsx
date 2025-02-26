"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  Mail,
  User,
  UserCircle,
  Eye,
  EyeOff,
  Globe,
  Pin,
} from "lucide-react";
import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import { useAuth } from "@/context/AuthContext";
import { AuthAPI } from "@/lib/Auth/Auth";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  town: string;
}

const SignupWizard: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupData>>({});

  const { onboardingData, setSignupData, setUser } = useAuth();
  const [countryData, setCountryData] = useState<
    { value: string; label: string }[]
  >([]);
  const [townData, setTownData] = useState<{ value: string; label: string }[]>(
    []
  );
  const [formData, setFormData] = useState<SignupData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    town: "",
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const data = await response.json();
        const formattedData = data
          .map((country: any) => ({
            value: country.name.common,
            label: country.name.common,
          }))
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        setCountryData(formattedData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();

    setFormData((prev) => ({ ...prev, ...onboardingData }));
  }, [onboardingData]);

  const fetchTowns = async (country: string) => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order: "asc",
            orderBy: "name",
            country,
          }),
        }
      );
      const data = await response.json();
      const formattedData = data.data
        .map((town: any) => ({
          value: town.city,
          label: town.city,
        }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label));
      setTownData(formattedData);
    } catch (error) {
      console.error("Error fetching towns:", error);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: UserCircle },
    { number: 2, title: "Account Details", icon: Mail },
    { number: 3, title: "Security", icon: Lock },
  ];

  const validateStep = () => {
    const newErrors: Partial<SignupData> = {};

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.username) newErrors.username = "Username is required";
    } else if (step === 2) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.town) newErrors.town = "Town is required";
    } else if (step === 3) {
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = useCallback(
    (key: keyof SignupData, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    },
    [errors]
  );

  const handleCountrySelect = (value: string) => {
    updateFormData("country", value);
    fetchTowns(value);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <InputField
              label="Full Name"
              icon={UserCircle}
              type="text"
              value={formData.fullName}
              onChange={(value: string) => updateFormData("fullName", value)}
              error={errors.fullName}
              placeholder="Enter your full name"
            />
            <InputField
              label="Username"
              icon={User}
              type="text"
              value={formData.username}
              onChange={(value: string) => updateFormData("username", value)}
              error={errors.username}
              placeholder="Choose a username"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <InputField
              label="Email Address"
              icon={Mail}
              type="email"
              value={formData.email}
              onChange={(value: string) => updateFormData("email", value)}
              error={errors.email}
              placeholder="Enter your email"
            />
            <div className="flex justify-between space-x-4">
              <Dropdown
                label="Country"
                icon={Globe}
                items={countryData}
                selectedItem={formData.country}
                onSelect={handleCountrySelect}
                error={errors.country}
              />
              <Dropdown
                label="Town"
                icon={Pin}
                items={townData}
                selectedItem={formData.town}
                onSelect={(value: string) => updateFormData("town", value)}
                error={errors.town}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/90 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className={`w-full bg-backgroundDark rounded-xl p-3 pr-10 text-white border
                    ${
                      errors.password
                        ? "border-red-500"
                        : "border-white/10 focus:border-primaryColor"
                    }
                    focus:outline-none focus:ring-1 focus:ring-primaryColor/20`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <InputField
              label="Confirm Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(value: string) =>
                updateFormData("confirmPassword", value)
              }
              error={errors.confirmPassword}
              placeholder="Confirm your password"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const { fullName, username, email, password, country, town } = formData;
        const response = await AuthAPI.registerUser({
          fullName,
          username,
          email,
          password,
          country,
          town,
          transport: onboardingData.transport,
          energy: onboardingData.energy,
          recycle: onboardingData.recycle,
        });
        setSignupData(response.user);
        setUser(response.user);

        router.push("/");
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({ email: "Registration failed. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen bg-backgroundDark">
      <div className="h-2 bg-primaryColor rounded-b-lg" />

      <div className="flex items-center justify-center my-8">
        <Logo />
      </div>

      <div className="max-w-md mx-auto p-4">
      <div className="flex justify-center text-center items-center gap-3 mb-12 mt-2">
          <div>
            <h1 className="text-white text-2xl font-bold">Welcome to CARBO</h1>
            <p className="text-[#6B7280] text-sm">Sign up to continue</p>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center gap-3">
            {steps.map((s) => (
              <React.Fragment key={s.number}>
                <div className="flex items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: step >= s.number ? 1 : 0.95,
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                      transition-colors duration-200
                      ${
                        step >= s.number
                          ? "bg-primaryColor text-black"
                          : "bg-backgroundLight text-white/50"
                      }`}
                  >
                    {step > s.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{s.number}</span>
                    )}
                  </motion.div>
                  <span className="ml-2 text-sm text-white/70">{s.title}</span>
                </div>
              
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-backgroundLight rounded-3xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-white/70 hover:text-white
                    transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="flex items-center gap-2 bg-primaryColor text-black font-medium
                  px-6 py-2 rounded-xl ml-auto transition-colors duration-200"
              >
                {step === 3 ? "Complete" : "Continue"}
                {step < 3 && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-[#6B7280]">
          Already have an account?{" "}
          <a href="/sign-in" className="text-primaryColor hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupWizard;