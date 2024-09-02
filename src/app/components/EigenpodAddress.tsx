import React from "react";

function EigenpodAddress() {
  return <div>Eigenpod Address</div>;
}

export default EigenpodAddress;
import React, { useState } from "react";
import { ClipboardCopy, CheckCircle } from "lucide-react";

function EigenpodAddress() {
  const [address, setAddress] = useState("EigenPod Address not created yet");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const createPodAddress = () => {
    setLoading(true);
    // Simulating address creation with a delay
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8  mx-auto transition-all duration-300 hover:shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-500 mb-6">
            EigenPod Address Creation
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Programmatically generate an Eigenpod address for users, reducing
            manual setup and enhancing convenience.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Programmatically generate an Eigenpod address for users, reducing
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
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <ClipboardCopy className="w-5 h-5" />
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
    </div>
  );
}

export default EigenpodAddress;
