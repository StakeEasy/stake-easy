"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EigenpodAddress from "../components/EigenpodAddress";
import KeyGeneration from "../components/KeyGeneration";
import UploadDepositData from "../components/UploadDepositData";
import ValidatorRegistration from "../components/ValidatorRegistration";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";

function Stepper() {
  const steps = [
    { title: "Personal Info", component: EigenpodAddress },
    { title: "Account Setup", component: KeyGeneration },
    { title: "Confirmation", component: UploadDepositData },
    { title: "Completion", component: ValidatorRegistration },
  ];

  const [currentStep, setCurrentStep] = useState(0);

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

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="w-[70%] h-[70vh] mx-auto my-[50px] p-8 bg-transparent rounded-xl shadow-lg flex flex-col justify-between">
      <div className="mb-12 relative">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-${index} flex flex-col items-center relative`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  index <= currentStep ? "bg-red-500 z-10" : "bg-gray-300 z-10"
                }`}
                animate={{
                  scale: index === currentStep ? 1.2 : 1,
                }}
              >
                {index + 1}
              </motion.div>
              {/* <p
                className={`mt-2 text-sm ${
                  index === currentStep
                    ? "font-medium text-gray-800"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </p> */}
            </div>
          ))}
        </div>

        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 " />
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-red-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="overflow-y-auto custom-scrollbar">
        <CurrentStepComponent />
      </div>

      <div className="flex justify-between mt-12">
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
