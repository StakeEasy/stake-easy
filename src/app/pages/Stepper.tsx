"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";

function Stepper() {
  const steps = [
    { title: "Personal Info", fields: ["Full Name", "Email", "Phone Number"] },
    { title: "Account Setup", fields: ["Username", "Password", "Preferences"] },
    {
      title: "Confirmation",
      fields: ["Review Details", "Terms Agreement", "Submit"],
    },
    { title: "Completion", fields: [] },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Automatically start the tour when the component mounts
    setRunTour(true);
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-12 relative">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-${index} flex flex-col items-center relative`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  index <= currentStep ? "bg-red-500" : "bg-gray-300"
                }`}
                animate={{
                  scale: index === currentStep ? 1.2 : 1,
                }}
              >
                {index + 1}
              </motion.div>
              <p
                className={`mt-2 text-sm ${
                  index === currentStep
                    ? "font-medium text-gray-800"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>

        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300" />
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-red-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {steps[currentStep].title}
        </h2>
        <div className="space-y-4">
          {steps[currentStep].fields.map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {field}
              </label>
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                placeholder={`Enter ${field.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center"
        >
          <ChevronLeft size={20} className="mr-2" />
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center"
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
          <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

export default Stepper;
