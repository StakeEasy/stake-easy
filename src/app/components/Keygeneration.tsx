import React, { useState } from "react";
import { Edit2, Check, Eye, EyeOff } from "lucide-react";

function KeyGeneration() {
  const steps = [
    "Open Terminal",
    "Navigate to Directory",
    "Enter Key Generation Command",
    "Input Required Information",
    "Verify Key Generation Output",
    "Store the Key Securely",
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
        Validator key generation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(2)].map((_, colIndex) => (
          <div key={colIndex} className="space-y-4">
            <h3 className="text-xl font-semibold text-red-500 mb-4">
              Validator key generation
            </h3>
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <span className="font-semibold mr-2">{`${index + 1}.`}</span>
                <span className="text-gray-800">{step}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KeyGeneration;
