import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const CompletionPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col bg-gray-900 p-6 text-white">
      <div className="flex justify-center mb-12">
        <div className="w-24 h-24 bg-primaryColor rounded-full flex items-center justify-center">
          <Check className="w-12 h-12 text-white" />
        </div>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-2xl font-semibold mb-4">
          Thank you for completing the process!
        </h1>
        <p className="text-gray-400">Your preferences have been saved</p>
      </div>

      <Link
        href={"/"}
        className="w-full bg-primaryColor text-white py-4 rounded-lg text-lg font-medium hover:bg-emerald-600 transition-colors text-center"
      >
        Finish
      </Link>
    </div>
  );
};

export default CompletionPage;
