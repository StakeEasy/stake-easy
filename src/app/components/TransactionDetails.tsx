"use client";
import React, { useState } from "react";
import { Copy, CheckCircle, ArrowLeft } from "lucide-react";
import Operator from "./Operator";
import { Info } from "lucide-react";
import { Tooltip } from "antd";
import { toast, Toaster } from "react-hot-toast";
import { ethers, BrowserProvider } from "ethers";
import contractABI from "../utils/ssvNetworkABI.json";
import { useAccount } from 'wagmi';
import { parse } from "path";

interface TransactionProps {
  goBack: () => void;
  parsedPayload: any;
  operatorsData: any;
  totalFee: number;
  networkFee: number;
  noDays: number;
}

const Tx = ({ goBack, parsedPayload, operatorsData, totalFee, networkFee, noDays }: TransactionProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    // navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy = async (text: any) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast("Copied 🎊🎉");
    setTimeout(() => setCopied(false), 2000);
  };

  const pubkey = parsedPayload.publicKey.slice(0,4) + "..." + parsedPayload.publicKey.slice(-4);

  const handleContractInteraction = async (parsedPayload: any) => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const contractAddress = "0x5Dbf9a62BbcC8135AF60912A8B0212a73e4a6629";

        // Create a Web3Provider instance
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);  
        

        const { publicKey, operatorIds, sharesData } = parsedPayload;
        
        const amount = ethers.parseEther("1.5"); // Convert 1.5 SSV to Wei
        const cluster = [0, 0, 0, true, 0];
        
        // Execute contract function
        const transaction = await contract.registerValidator(publicKey, operatorIds, sharesData, amount, cluster);
        const receipt = await transaction.wait();
        
        console.log("Transaction receipt:", receipt);
      } else {
        console.error("MetaMask is not installed");
      }
    } catch (error) {
      console.error("Error during contract interaction:", error);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="max-w-2xl mx-auto text-white rounded-lg shadow-md border border-gray-200">
        <div className="text-white p-4 rounded-t-lg border">
          <button
            onClick={goBack}
            className="flex items-center mb-4 text-white "
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1
            className="text-xl font-bold mb-2"
            style={{
              background: "linear-gradient(to right, #DA619C, #FF844A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Transaction Details
          </h1>
          <p className="text-sm">Validator Public Key</p>
          <div className="text-xs flex justify-between items-center gap-2 mt-1 py-4 px-2 bg-gray-950 rounded-[8px]">
            <span>
              {pubkey}
            </span>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => {
                handleCopy(pubkey);
              }}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Selected Operators</h2>
          <Operator name={operatorsData[0].name} id={operatorsData[0].id} ssv={operatorsData[0].yearlyFee} days={noDays} />
          <Operator name={operatorsData[1].name} id={operatorsData[1].id} ssv={operatorsData[1].yearlyFee} days={noDays} />
          <Operator name={operatorsData[2].name} id={operatorsData[2].id} ssv={operatorsData[2].yearlyFee} days={noDays} />
          <Operator name={operatorsData[3].name} id={operatorsData[3].id} ssv={operatorsData[3].yearlyFee} days={noDays} />
        </div>
        <div className="text-white p-4 rounded-b-lg">
          <div className="w-[calc(100%+32px)] border-b-2 border-gray-400 -ml-4 mb-2"></div>

          <h2
            className="text-lg font-bold"
            style={{
              background: "linear-gradient(90deg, #FFA800 0%, #DA619C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            // background: linear-gradient(90deg, #FFA800 0%, #DA619C 100%);
          >
            Funding Summary
          </h2>
          <div className="flex justify-between">
            <span className="flex items-center">
              Operator fee
              <Tooltip
                title="Estimated amount of days the cluster balance is sufficient to run all it’s validators"
                color="#121212"
                overlayInnerStyle={{
                  border: "1px solid transparent",
                  borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                  borderImageSlice: 1,
                  fontSize: "12px",
                }}
              >
                <Info size={10} className="ml-1" />
              </Tooltip>
            </span>
            <span>{totalFee} SSV</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center">
              Network fee
              <Tooltip
                title="Estimated amount of days the cluster balance is sufficient to run all it’s validators"
                color="#121212"
                overlayInnerStyle={{
                  border: "1px solid transparent",
                  borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                  borderImageSlice: 1,
                  fontSize: "12px",
                }}
              >
                <Info size={10} className="ml-1" />
              </Tooltip>
            </span>
            <span>{networkFee} SSV</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center">
              Liquidation collateral
              <Tooltip
                title="Estimated amount of days the cluster balance is sufficient to run all it’s validators"
                color="#121212"
                overlayInnerStyle={{
                  border: "1px solid transparent",
                  borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                  borderImageSlice: 1,
                  fontSize: "12px",
                }}
              >
                <Info size={10} className="ml-1" />
              </Tooltip>
            </span>
            <span>1.0 SSV</span>
          </div>
          <div className="w-[calc(100%+32px)] border-b-2 border-gray-400 mt-2 -ml-4"></div>
          <div className="flex justify-between mt-2">
            <span>Total</span>
            <span>{totalFee + networkFee +1} SSV</span>
          </div>
        </div>
        <div className="flex justify-center p-4 gap-4">
          <button
            onClick={() => handleContractInteraction(parsedPayload)}
            className="flex-1 font-bold text-white py-2 px-4 rounded"
            style={{
              border: "1px solid transparent",
              borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
              borderImageSlice: 1,
              background: "linear-gradient(to right, #DA619C, #FF844A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Approve SSV
          </button>
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

export default Tx;
