import React, { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { Contract, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { CheckCircle, CloudUpload, X, Info } from "lucide-react";
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
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-8 mx-auto">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${showPopup ? "blur-sm" : ""}`}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-500 mb-6">Upload Deposit Data</h2>
          <p className="text-sm text-gray-600">
            Submit deposit file, and stake 32 ETH to Ethereum Deposit Contract to complete validator indexing at Beacon chain.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-300 rounded-md overflow-hidden p-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                {file ? (
                  <CheckCircle className="h-12 w-12 text-gray-500 mb-4" />
                ) : (
                  <CloudUpload className="h-12 w-12 text-gray-500 mb-4" />
                )}
                <p className="text-gray-500 mb-2">{file ? file.name : "Drag file to upload or browse"}</p>
              </label>
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" id="file-upload" />
            </div>
          </div>

          <button
            onClick={startDepositTransaction}
            disabled={!file || !isConnected || isDepositLoading}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded border border-blue-200 text-sm transition-colors duration-300 ${(!file || !isConnected || isDepositLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default UploadDepositData;