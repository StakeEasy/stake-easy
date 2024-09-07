import React, { useState, useEffect, useRef } from "react";
import {
  Copy,
  CheckCircle,
  X,
  Info,
  MessageCircleQuestionIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OperatorSelectionTable from "./OperatorSelectionTable";

function ValidatorRegistration() {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenRegisrationPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("hasSeenRegisrationPopup", "true");
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <div
      className="relative mx-auto transition-all duration-300 w-[85%]"
      style={{
        background: "linear-gradient(to right, #1D1D1D 0%, #191919 100%)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "30px 40px",
        borderRadius: "20px",
      }}
    >
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              ref={popupRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                borderImageSlice: 1,
                color: "white",
                textAlign: "center",
                background: "linear-gradient(to right, #121212, #252525)",
                boxShadow: "18px 26px 70px 0px rgba(255, 231, 105, 0.09);",
                padding: "3rem 2rem",
              }}
              className=" rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <div className="flex justify-between items-center mb-4 ">
                <h1
                  className=" py-1  text-sm "
                  style={{
                    borderRadius: "8px",
                    fontSize: "1.7rem",
                    textAlign: "justify",
                    lineHeight: "3rem",
                    background: "linear-gradient(to right, #DA619C, #FF844A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Select Operators
                </h1>
              </div>

              <button
                onClick={closePopup}
                style={{
                  padding: "5px",
                }}
                className="absolute top-2 right-2 text-[#FC8150] "
              >
                <X className="w-5 h-5" />
              </button>

              <div style={{ textAlign: "justify", paddingBottom: "10px" }}>
                Here, you will select operators to run your validator on the SSV
                network. The 3m+1 criteria will ensure that your validator
                remains operational even if one operator fails. For example, if
                you select four operators, at least three of them must sign
                transactions.
              </div>
              <div style={{ textAlign: "justify" }}>
                You can choose from a variety of operators, view detailed
                statistics about their performance and reliability, and make an
                informed decision. Additionally, you will manage the fees
                associated with each operator, ensuring that your validator is
                set up with the right balance of cost and redundancy
              </div>
              <div style={{ textAlign: "justify" }}>
                Then you will have to enter a keystore password that you have
                generated before in the second step with the keystore file under
                Enter Validator Key step
              </div>
              <div style={{ textAlign: "justify" }}>
                You will also configure the duration for which your selected
                operators will run. You can choose from predefined time periods
                or enter a custom duration that suits your needs. The fees for
                running your operators will vary based on the selected time
                period. Once you have made your selection, a comprehensive
                summary of the total fees will be displayed, showing the amount
                you need to pay to register your validator on the Stake Easy
                network
              </div>
              <button
                onClick={closePopup}
                style={{
                  background: "linear-gradient(to right, #A257EC, #D360A6)",
                  textAlign: "center",
                  color: "white",
                  marginTop: "10px",
                }}
                className=" text-white py-2 px-4 rounded-md shadow-lg text-center"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <OperatorSelectionTable />
      <button
        onClick={openPopup}
        className="text-[#FC8150] flex items-center space-x-2 text-sm"
      >
        <MessageCircleQuestionIcon className="w-4 h-4" />
        <span>Learn more about Select Operators</span>
      </button>
    </div>
  );
}

export default ValidatorRegistration;
