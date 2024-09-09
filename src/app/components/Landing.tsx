"use client";
import React, { useState, useRef, useEffect } from "react";
import "../css/Landing.css";
import { useRouter } from "next/navigation";
import { X, HelpCircle, Copy, ChevronRight } from "lucide-react";
import copy from "copy-to-clipboard";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Landing = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleMainSteps = () => {
    router.push("/join");
  };

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

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Copied 🎊🎉");
  };

  return (
    <div className="w-full my-[10px] bg-transparent rounded-xl flex flex-col justify-center items-center">
      <div className="text-white flex flex-col items-center justify-center gap-2 relative mx-auto transition-all duration-300 w-full lg:w-[80%]">
        <h1 className="text-4xl lg:text-7xl font-bold">Stake - Earn - Spend</h1>
        <h3 className="text-[16px] lg:text-[20px] font-light text-center">
          Stake ETH, get eETH - the liquid restaking token that rewards
        </h3>
        <h3 className="text-[16px] lg:text-[20px] font-light text-center">
          you more across DeFi.
        </h3>

        <button
          className="stake border-2 border-gray-100 hover:scale-105 transform hover:border-gray-300 text-white py-2 px-8 lg:px-[60px] rounded-md text-[16px] lg:text-[20px] transition-all duration-500 mt-3"
          onClick={openPopup}
        >
          Stake
        </button>

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
                initial={{ scale: 0.9, opacity: 0, y: -50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6"
                style={{
                  border: "1px solid transparent",
                  borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                  borderImageSlice: 1,
                  color: "white",
                  textAlign: "center",
                  background: "linear-gradient(to right, #121212, #252525)",
                  boxShadow: "18px 26px 70px 0px rgba(255, 231, 105, 0.09);",
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h1
                    className="inline-block py-1  text-sm"
                    style={{
                      borderRadius: "8px",
                      fontSize: "1.7rem",
                      textAlign: "justify",
                      background: "linear-gradient(to right, #DA619C, #FF844A)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Prerequisite 1
                  </h1>
                  {/* <button
                    onClick={closePopup}
                    className="absolute top-2 right-2 text-[#FC8150]"
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    <X size={20} />
                  </button> */}
                </div>

                <div className="flex gap-2 items-center">
                  <ChevronRight
                    className="mb-[4px] text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <h3 className="text-justify mb-1 text-lg">Get SSV Tokens</h3>
                </div>

                <div className="text-justify mb-2 text-sm">
                  To pay the operator and network fee, SSV tokens are required.
                  If you dont have any, you can get them from the SSV faucet.
                </div>

                <div className="bg-black p-3 rounded-xl flex justify-between items-center mb-[5px]">
                  <a
                    href="https://faucet.ssv.network/"
                    target="blank"
                    style={{ color: "#A257EC" }}
                  >
                    https://faucet.ssv.network/
                  </a>
                  <span
                    className="cursor-pointer"
                    onClick={() => handleCopy("https://faucet.ssv.network/")}
                    title="Copy"
                  >
                    <Copy size={20} className="cursor-pointer" />
                  </span>
                </div>

                <div className="flex justify-between items-center mb-3 mt-10">
                  <h1
                    className="inline-block py-1  text-sm"
                    style={{
                      borderRadius: "8px",
                      fontSize: "1.7rem",
                      textAlign: "justify",
                      background: "linear-gradient(to right, #DA619C, #FF844A)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Prerequisite 2
                  </h1>
                  <button
                    onClick={closePopup}
                    style={{
                      padding: "5px",
                    }}
                    className="absolute top-2 right-2 text-[#FC8150] "
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex gap-2 items-center">
                  <ChevronRight
                    className="mb-[4px] text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <h3 className="text-justify mb-1 text-lg">Download Wagyu</h3>
                </div>

                <div className="mb-2 text-justify text-sm">
                  If you dont have Wagyu installed, you can download it from the
                  Wagyu website. Wagyu is audited and community accepted GUI tool for
                  safely generating and managing your staking keys.
                </div>

                <div className="bg-black p-3 rounded-xl flex justify-between items-center mb-[5px]">
                  <a
                    href="https://wagyu.gg/"
                    target="blank"
                    style={{ color: "#A257EC" }}
                  >
                    https://wagyu.gg/
                  </a>
                  <span
                    className="cursor-pointer"
                    onClick={() => handleCopy("https://wagyu.gg/")}
                    title="Copy"
                  >
                    <Copy size={20} className="cursor-pointer" />
                  </span>
                </div>

                <button
                  onClick={handleMainSteps}
                  style={{
                    background: "linear-gradient(to right, #A257EC, #D360A6)",
                    textAlign: "center",
                    color: "white",
                    marginTop: "30px",
                  }}
                  className="w-[30%] text-white hover:scale-110 duration-500 py-2 px-4 rounded-md shadow-lg text-center transition 0.3"
                >
                  Stake
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 bg-[#f28357]"></div>
      </div>
      <Toaster
        toastOptions={{
          style: {
            border: "1px solid transparent",
            borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
            borderImageSlice: 1,
            background: "black",
            color: "white",
          },
        }}
      />
    </div>
  );
};

export default Landing;
