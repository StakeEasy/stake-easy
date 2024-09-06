"use client";
import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Key,
  Pencil,
  Upload,
  X,
  MessageCircleQuestionIcon,
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const closePopup = () => {
    setShowPopup(false);
  };
  const openPopup = () => {
    setShowPopup(true);
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
                  className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white font-bold ${
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

      <div>
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

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                borderImageSlice: 1,
                color: "white",
                background: "linear-gradient(to right, #121212, #252525)",
                boxShadow: "18px 26px 70px 0px rgba(255, 231, 105, 0.09);",
                padding: "4rem 3rem",
              }}
              className=" rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <div className="flex justify-between items-center mb-4 ">
                <h1 className="text-white">Eigenpod address</h1>
                <button
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "15px",
                    borderRadius: "15px",
                    border: "1px solid white",
                    padding: "2px",
                  }}
                  onClick={closePopup}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div>
                Programmatically generate an EigenPod address for users,
                reducing manual setup and enhancing convenience.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Button to Reopen Popup */}

      <div className="mt-8 text-center relative">
        <button
          onClick={openPopup}
          className=" absolute right-0 inline-flex items-center text-white py-2 px-4 rounded-md "
        >
          <MessageCircleQuestionIcon />
        </button>
      </div>

    </div>
  );
}

export default Stepper;