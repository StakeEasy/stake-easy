"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Key,
  Pencil,
  Upload,
} from "lucide-react";
import starImg from "../assets/Frame 5.png";

import EigenpodAddress from "../components/EigenpodAddress";
import KeyGeneration from "../components/KeyGeneration";
import UploadDepositData from "../components/UploadDepositData";
import ValidatorRegistration from "../components/ValidatorRegistration";

const steps = [
  { title: "EigenpodAddress", component: EigenpodAddress, icon: Plus },
  { title: "KeyGeneration", component: KeyGeneration, icon: Plus },
  { title: "ValidatorRegistration", component: ValidatorRegistration, icon: Plus },
  { title: "UploadDepositData", component: UploadDepositData, icon: Plus },
];

function Stepper() {
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
    <div className="w-full h-[80vh] my-[10px] bg-transparent rounded-xl flex flex-col justify-between">
      <Image
        src={starImg}
        alt=""
        className="w-70 h-70 absolute bottom-16 left-0"
      />
      <div className="mb-12 relative w-full">
        <div className="flex justify-between items-center w-full relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`step flex flex-col items-center relative w-full`}
              >
                <motion.div
                  className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-white font-bold ${
                    index <= currentStep
                      ? "bg-gradient-to-b from-[#FC8151] to-[#C951C0]"
                      : "bg-[#585858]"
                  } ${
                    index === 0 && currentStep === 0 ? "  ring-opacity-50" : ""
                  } z-10`}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#414141] transform -translate-y-1/2" />

        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#FC8151] to-[#C951C0] transform -translate-y-1/2 z-0"
          initial={{ width: "14%" }}
          animate={{
            width: `${Math.max(14, (currentStep / (steps.length - 1)) * 100)}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="overflow-auto custom-scrollbar ">
        <CurrentStepComponent />
      </div>

      <div className="flex justify-end mt-12 w-[90%]">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          style={{
            border: "1px solid transparent",
            borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
            borderImageSlice: 1,
            color: "white",
            background: "linear-gradient(to right, #121212, #252525)",
            borderRadius: "15px",
          }}
          className="px-6 py-2 mx-2.5 my-0  rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center"
        >
          <ChevronLeft size={20} className="mr-2" text-white/>
          Back
        </button>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-6 py-2  disabled:opacity-50 transition-colors flex items-center"
          style={{
            border: "1px solid transparent",
            borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
            borderImageSlice: 1,
            color: "white",
            background: "linear-gradient(to right, #121212, #252525)",
          }}
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
          <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

export default Stepper;