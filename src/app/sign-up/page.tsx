"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  Mail,
  User,
  UserCircle,
} from "lucide-react";

interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateFormData = (key: keyof SignupData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Account Details" },
    { number: 3, title: "Security" },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/90 flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData("fullName", e.target.value)}
                className="w-full bg-backgroundDark rounded-xl p-3 text-white border border-white/10 focus:border-primaryColor focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/90 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => updateFormData("username", e.target.value)}
                className="w-full bg-backgroundDark rounded-xl p-3 text-white border border-white/10 focus:border-primaryColor focus:outline-none"
                placeholder="Choose a username"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/90 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="w-full bg-backgroundDark rounded-xl p-3 text-white border border-white/10 focus:border-primaryColor focus:outline-none"
                placeholder="Enter your email"
                required
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
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                className="w-full bg-backgroundDark rounded-xl p-3 text-white border border-white/10 focus:border-primaryColor focus:outline-none"
                placeholder="Create a password"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/90 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  updateFormData("confirmPassword", e.target.value)
                }
                className="w-full bg-backgroundDark rounded-xl p-3 text-white border border-white/10 focus:border-primaryColor focus:outline-none"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log("Form submitted:", formData);
      // Handle form submission
    }
  };

  return (
    <div className="min-h-screen bg-backgroundDark">
      {/* Top Gradient Bar */}
      <div className="h-2 bg-primaryColor rounded-b-lg" />

      <div className="max-w-md mx-auto p-4">
        {/* Steps Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                  </div>
                  <span className="ml-2 text-sm text-white/70">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      step > s.number ? "bg-primaryColor" : "bg-backgroundLight"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-backgroundLight rounded-3xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-white/70 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                type="submit"
                className={`flex items-center gap-2 bg-primaryColor text-black font-medium px-6 py-2 rounded-xl ml-auto`}
              >
                {step === 3 ? "Complete" : "Continue"}
                {step < 3 && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-[#6B7280]">
          Already have an account?{" "}
          <a href="/signin" className="text-primaryColor hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupWizard;
