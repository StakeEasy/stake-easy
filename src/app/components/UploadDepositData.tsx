import React, { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { Contract, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { CheckCircle, CloudUpload, X, Info } from "lucide-react";
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
      className="relative mx-auto transition-all duration-300 w-[70%]"
      style={{
        background: "linear-gradient(to right, #1D1D1D 0%, #191919 100%)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "60px 40px",
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
                padding: "4rem 3rem",
              }}
              className=" rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <div className="flex justify-between items-center mb-4 ">
                <div
                  className="inline-block 3 py-1  text-sm mb-3"
                  style={{
                    borderRadius: "8px",
                    fontSize: "1.7rem",
                    textAlign: "justify",
                  }}
                >
                  Upload Deposit Data
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
              </div>

              <div style={{ textAlign: "justify", paddingBottom: "10px" }}>
                Here, you have to upload the deposit file and confirm the
                transaction for staking 32 ETH for Validator beacon node
                activation.
              </div>

              <button
                onClick={closePopup}
                style={{
                  background: "linear-gradient(to right, #A257EC, #D360A6)",
                  textAlign: "center",
                  color: "white",
                  marginTop: "30px",
                }}
                className=" text-white py-2 px-4 rounded-md shadow-lg text-center"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative text-white rounded-xl shadow-sm p-4 mx-auto">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${
            showPopup ? "blur-sm" : ""
          }`}
        >
          <div className="flex flex-col justify-center">
            <h2
              className="text-2xl font-bold mb-3"
              style={{
                background: "linear-gradient(to right, #DA619C, #FF844A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Upload Deposit Data
            </h2>

            <p className="text-white text-md">
              Learn how to seamlessly upload deposit data, ensuring your
              validator registration is complete and processed on the stake-easy
              network
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex flex-col items-center justify-center bg-[#161515] rounded-md overflow-hidden p-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {file ? (
                    <CheckCircle className="h-12 w-12 text-gray-500 mb-4" />
                  ) : (
                    <CloudUpload className="h-16 w-16 mb-4 p-4 bg-gradient-to-b from-[#FC8151] to-[#C951C0] text-white rounded-full" />
                  )}
                  <p className="text-white mb-2">
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
    </div>
  </div>
  );
} 

export default UploadDepositData;