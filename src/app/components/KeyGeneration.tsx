import React, { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function KeyGeneration() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup
    const hasSeenPopup = localStorage.getItem("hasSeenKeyGenPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("hasSeenKeyGenPopup", "true");
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  // Steps for Method 1 (Terminal)
  const terminalSteps = [
    "Open Terminal",
    "Navigate to Directory",
    "Enter Key Generation Command",
    "Input Required Information",
    "Verify Key Generation Output",
    "Store the Key Securely",
  ];

  // Steps for Method 2 (Wagyu GUI App)
  const wagyuSteps = [
    "Download and Install Wagyu",
    "Open the Wagyu App",
    "Select 'Generate Key'",
    "Follow the On-Screen Instructions",
    "Save the Generated Key",
    "Verify the Key in the App",
  ];

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-8 mx-auto max-w-4xl">
      {/* Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="absolute inset-0 flex justify-center items-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={closePopup}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Validator Key Generation Guide
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how to generate your validator key using either the
                Terminal method or the Wagyu GUI app. Follow the steps carefully
                to ensure your key is generated and stored securely.
              </p>
              <button
                onClick={closePopup}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Blur Effect */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-300 ${
          showPopup ? "blur-sm" : ""
        }`}
      >
        {/* Method 1: Terminal */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-500 mb-4">
            Method 1: Terminal
          </h3>
          {terminalSteps.map((step, index) => (
            <div key={index} className="flex items-start">
              <span className="font-semibold mr-2">{`${index + 1}.`}</span>
              <span className="text-gray-800">{step}</span>
            </div>
          ))}
        </div>

        {/* Method 2: Wagyu GUI App */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-500 mb-4">
            Method 2: Wagyu GUI App
          </h3>
          {wagyuSteps.map((step, index) => (
            <div key={index} className="flex items-start">
              <span className="font-semibold mr-2">{`${index + 1}.`}</span>
              <span className="text-gray-800">{step}</span>
            </div>
          ))}
        </div>
        {/* Button to Reopen Popup */}
        <div className="mt-8 text-center">
          <button
            onClick={openPopup}
            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg"
          >
            <Info className="w-5 h-5 mr-2" />
            Show Key Generation Guide
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeyGeneration;
