import React, { useState, useEffect } from "react";
import { ClipboardCopy, CheckCircle, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function EigenpodAddress() {
  const [address, setAddress] = useState("EigenPod Address not created yet");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenEigenPodPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("hasSeenEigenPodPopup", "true");
    }
  }, []);

  const createPodAddress = () => {
    setLoading(true);
    setTimeout(() => {
      setAddress("0x1234...5678");
      setLoading(false);
    }, 1000);
  };

  const getPodAddress = () => {
    alert(`Current EigenPod Address: ${address}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-8 mx-auto transition-all duration-300 hover:shadow-xl">
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
                Welcome to EigenPod Address Creation
              </h3>
              <p className="text-gray-600 mb-4">
                This tool allows you to programmatically generate an EigenPod
                address, making the setup process easier and more convenient.
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
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-300 ${
          showPopup ? "blur-sm" : ""
        }`}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-500 mb-6">
            EigenPod Address Creation
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Programmatically generate an EigenPod address for users, reducing
            manual setup and enhancing convenience.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              EigenPod Address
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                value={address}
                readOnly
                className="flex-grow bg-transparent px-4 py-3 text-gray-800 focus:outline-none"
              />
              <button
                className={`p-3 text-gray-500 hover:text-gray-700 transition-colors ${
                  copied ? "text-green-500" : ""
                }`}
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <ClipboardCopy className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={createPodAddress}
              disabled={loading}
              className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-sm transition-all duration-300 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Pod Address"}
            </button>
            <button
              onClick={getPodAddress}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-sm transition-all duration-300"
            >
              Get Pod Address
            </button>
          </div>
        </div>
      </div>

      {/* Button to Reopen Popup */}
      <div className="mt-8 text-center">
        <button
          onClick={openPopup}
          className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg"
        >
          <Info className="w-5 h-5 mr-2" />
          Show Welcome Message
        </button>
      </div>
    </div>
  );
}

export default EigenpodAddress;