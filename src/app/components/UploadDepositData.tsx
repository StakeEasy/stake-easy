import React, { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { Contract, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { CheckCircle, Eye, EyeOff, CloudUpload, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import depositContractABI from "../utils/depositABI.json";
import { prefix0X, TransactionStatus } from "../utils/helpers";

const DEPOSIT_CONTRACT_ADDRESS = '0x4242424242424242424242424242424242424242';
const PRICE_PER_VALIDATOR = 32;

interface WindowWithEthereum extends Window {
  ethereum?: any;
}

declare let window: WindowWithEthereum;

function UploadDepositData() {
  const [file, setFile] = useState<File | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [depositData, setDepositData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isDepositSuccess, setIsDepositSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, isConnected, chain } = useAccount();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new Contract(
    DEPOSIT_CONTRACT_ADDRESS,
    depositContractABI,
    signer
  );

  // const { connector } = useAccount();
  // const provider = connector?.getProvider();
  // const web3 = new Web3(provider as any);
  // const contract = new web3.eth.Contract(depositContractABI as any, DEPOSIT_CONTRACT_ADDRESS); 

  const updateTransactionStatus = (
    pubkey: string,
    status: TransactionStatus,
    txHash?: string
  ) => {
    // update transaction status
  };

  const startDepositTransaction = async () => {
    setError(null);
    setIsDepositLoading(true);
    setIsDepositSuccess(false);
    setTxHash(null);

    if (depositData.pubkey === null || depositData.withdrawal_credentials === null || depositData.signature === null || depositData.deposit_data_root === null) {
      setError("Invalid JSON file. Please upload a valid deposit data file.");
      setIsDepositLoading(false);
      return;
    }

    if (chain?.id !== 17000) {
      setError("Please connect to the Holesky testnet to continue.");
      setIsDepositLoading(false);
      return;
    }

    
    try {
      console.log("Deposit data:", depositData);
      const gasPrice = await provider.getGasPrice();

      const pubkey = prefix0X(depositData[0].pubkey);
      const withdrawal_credentials = prefix0X(depositData[0].withdrawal_credentials);
      const signature = prefix0X(depositData[0].signature);
      const deposit_data_root = prefix0X(depositData[0].deposit_data_root);

      // console.log("Pubkey:", pubkey);
      // console.log('Pubkey:', depositData[0].pubkey);
      // console.log("Withdrawal credentials:", withdrawal_credentials);
      // console.log("Signature:", signature);
      // console.log("Deposit data root:", deposit_data_root);

      const tx = await contract.deposit(
        ethers.utils.arrayify(pubkey),
        ethers.utils.arrayify(withdrawal_credentials),
        ethers.utils.arrayify(signature),
        deposit_data_root,
        {
          gasPrice: gasPrice,
          value: parseEther((PRICE_PER_VALIDATOR).toString()),
        }
      );

      setTxHash(tx.hash);
      updateTransactionStatus(depositData.pubkey, TransactionStatus.PENDING, tx.hash);

      const receipt = await tx.wait();
      if (receipt.status) {
        setIsDepositSuccess(true);
        updateTransactionStatus(depositData.pubkey, TransactionStatus.SUCCEEDED, tx.hash);
      } else {
        updateTransactionStatus(depositData.pubkey, TransactionStatus.FAILED, tx.hash);
      }
    } catch (error) {
      console.error("Error initiating deposit transaction:", error);
      setError("Failed to initiate deposit transaction. Please try again.");
      setIsDepositLoading(false);
      setIsDepositSuccess(false);
    } 
  }

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenUploadPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("hasSeenUploadPopup", "true");
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonContent = JSON.parse(event.target?.result as string);
          setDepositData(jsonContent);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          setError("Invalid JSON file. Please upload a valid deposit data file.");
        }
      };
      reader.readAsText(file);
    }
  }, [file]);

  const closePopup = () => {
    setShowPopup(false);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

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
                Welcome to Upload Deposit Data
              </h3>
              <p className="text-gray-600 mb-4">
              Submit deposit file, and stake 32 ETH to Ethereum Deposit Contract to complete validator indexing at Beacon chain.
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
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${
          showPopup ? "blur-sm" : ""
        }`}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-500 mb-6">
            Upload Deposit Data
          </h2>

          <p className="text-sm text-gray-600">
            Programmatically generate an Eigenpod address for users, reducing
            manual setup and enhancing convenience
          </p>
          <p className="text-sm text-gray-600">
            Programmatically generate an Eigenpod address for users, reducing
            manual setup and enhancing convenience
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-300 rounded-md overflow-hidden p-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {file ? (
                  <CheckCircle className="h-12 w-12 text-gray-500 mb-4" />
                ) : (
                  <CloudUpload className="h-12 w-12 text-gray-500 mb-4" />
                )}
                <p className="text-gray-500 mb-2">
                  {file ? file.name : "Drag file to upload or browse"}
                </p>
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
            </div>
          </div>

          <div>
            
          <button
            onClick={startDepositTransaction}
            disabled={!file || !isConnected || isDepositLoading}
            style={{
              border: "1px solid transparent",
              borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
              borderImageSlice: 1,
              background: "linear-gradient(to right, #DA619C, #FF844A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className=" grow text-white py-[6px] px-4 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-orange-600 focus:ring-opacity-50 font-bold"
          >
            {isDepositLoading ? 'Staking...' : 'Stake ETH'}
          </button>
          {isDepositSuccess && (
            <p className="text-green-500">Stake successful! Transaction hash: {txHash}</p>
          )}
          {error && (
            <p className="text-red-500">{error}</p>
          )}
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
  </div>
  );
}

export default UploadDepositData;