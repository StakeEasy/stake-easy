import React, { useState, useEffect, useRef } from "react";
import { Copy, CheckCircle, X, MessageCircleQuestionIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useAccount } from "wagmi";
import { BrowserProvider, Contract } from "ethers";
import eigenPodManagerAbi from "../utils/eigenpodABI.json";

interface WindowWithEthereum extends Window {
  ethereum?: any;
}
declare let window: WindowWithEthereum;

const EigenpodAddress: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [contract, setContract] = useState<Contract | null>(null);
  const [podAddress, setPodAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [gettingLoading, setGettingLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(
    "EigenPod Address not created yet"
  );
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenEigenPodPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("hasSeenEigenPodPopup", "true");
    }
  }, []);

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const signer = await provider.getSigner();
          const contractInstance = new Contract(
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
            eigenPodManagerAbi,
            signer
          );
          setContract(contractInstance);
        } catch (error) {
          const err = error as { code?: number; message?: string };
          if (err.code === -32002) {
            console.error(
              "A request to connect your wallet is already pending. Please check your MetaMask extension."
            );
          } else {
            console.error("An error occurred:", error);
          }
        }
      } else {
        console.error("Ethereum wallet is not detected.");
      }
    };
    initializeContract();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setCurrentAddress("EigenPod Address not created yet");
    } else if (podAddress) {
      setCurrentAddress(podAddress);
    }
  }, [isConnected, podAddress]);

  const createPod = async (): Promise<string | null> => {
    if (!contract) {
      console.error("Contract not available");
      return null;
    }
    try {
      const podExists = await contract.hasPod(address);
      if (podExists) {
        const existingPod = await contract.getPod(address);
        toast.success(`Pod already exists!`);
        setPodAddress(existingPod);
        return existingPod;
      }
      const tx = await contract.createPod();
      const receipt = await tx.wait();
      const newPodAddress = await contract.getPod(address);
      toast.success(`Pod created successfully!`);
      setPodAddress(newPodAddress);
      return newPodAddress;
    } catch (error) {
      console.error("Error creating EigenPod:", error);
      toast.error("Error creating EigenPod. Check the console for details.");
      return null;
    }
  };

  const getPodAddress = async (): Promise<string | null> => {
    if (!contract || !address) {
      console.error("Contract or address not available");
      return null;
    }
    try {
      const podExists = await contract.hasPod(address);
      if (podExists) {
        const existingPod = await contract.getPod(address);
        setPodAddress(existingPod);
        return existingPod;
      } else {
        toast.error("No EigenPod Address found.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving pod information:", error);
      return null;
    }
  };

  const handleCreatePodAddress = async () => {
    if (!contract) {
      console.error("Contract not available");
      return;
    }
    setCreatingLoading(true);
    const newPodAddress = await createPod();
    if (newPodAddress) {
      setCurrentAddress(newPodAddress);
    }
    setCreatingLoading(false);
  };

  const handleGetPodAddress = async () => {
    if (!contract) {
      console.error("Contract not available");
      return;
    }
    setGettingLoading(true);
    const existingAddress = await getPodAddress();
    if (existingAddress) {
      setCurrentAddress(existingAddress);
      toast.success(`Current EigenPod Address: ${existingAddress}`);
    }
    setGettingLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Address copied to clipboard!");
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

  return (
    <div
      className="relative mx-auto transition-all duration-300 w-[80%]"
      style={{
        background: "linear-gradient(to right, #1D1D1D 0%, #191919 100%)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "80px 40px",
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
                  Eigenpod Address
                </h1>
              </div>
              <button
                onClick={closePopup}
                className="absolute top-2 right-2 text-[#FC8150] p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <div style={{ textAlign: "justify" }} className="flex ">
                You will generate an EigenPod address, which will serve as the
                withdrawal address for any amounts restaked by your validator.
                This address is used to manage the funds restaked between
                different operators.
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
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-300 ${
          showPopup ? "blur-sm" : ""
        }`}
      >
        <div className="space-y-4">
          <h2
            className="text-2xl font-bold text-white mb-7"
            style={{ letterSpacing: "1px", fontWeight: "bold" }}
          >
            EigenPod Address Creation
          </h2>
          <p
            className="text-white leading-relaxed w-[70%]"
            style={{ fontWeight: "200", fontSize: "14px" }}
          >
            You will generate an EigenPod address, which will serve as the
            withdrawal address for any amounts restaked by your validator.
          </p>
          <button
            onClick={openPopup}
            className="text-[#FC8150] flex items-center space-x-2 text-sm"
          >
            <MessageCircleQuestionIcon className="w-4 h-4" />
            <span>Learn more about EigenPod Address</span>
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-[#CACACA] mb-2"
              style={{
                fontWeight: "400",
                fontSize: "15px",
                letterSpacing: "1px",
              }}
            >
              EigenPod Address
            </label>
            <div className="flex items-center bg-[#161515] border focus:outline-none rounded-md overflow-hidden transition-all duration-300 focus-within:ring-1 ">
              <input
                type="text"
                value={currentAddress}
                readOnly
                className="flex-grow bg-transparent px-4 py-3 focus:outline-none"
                style={{ color: "rgba(202, 202, 202, 0.40)" }}
              />
              <button
                className={`p-3 text-[#FC8150] transition-colors ${
                  copied ? "text-[#FC8150]" : ""
                }`}
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Copy className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleCreatePodAddress}
              disabled={creatingLoading || !isConnected}
              className={`flex-1 bg-[#161515] text-white font-bold py-3 px-4 rounded-md text-sm transition-all duration-300 ${
                creatingLoading || !isConnected
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
              style={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
                borderImageSlice: 1,
                background: "linear-gradient(to right, #DA619C, #FF844A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {creatingLoading ? "Creating..." : "Create Pod Address"}
            </button>
            <button
              onClick={handleGetPodAddress}
              disabled={gettingLoading || !isConnected}
              style={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
                borderImageSlice: 1,
                background: "linear-gradient(to right, #DA619C, #FF844A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className={`flex-1 bg-[#161515] text-white font-bold py-3 px-4 rounded-md text-sm transition-all duration-300 ${
                gettingLoading || !isConnected
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
            >
              {gettingLoading ? "Getting..." : "Get Pod Address"}
            </button>
          </div>
        </div>
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
export default EigenpodAddress;