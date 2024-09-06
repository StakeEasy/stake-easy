"use client";
import React, { useState } from "react";
import { Copy, CheckCircle, ArrowLeft } from "lucide-react";
import Operator from "./Operator";
import { Info } from "lucide-react";
import { Tooltip } from "antd";

interface TransactionProps {
  goBack: () => void; 
}

const Tx = ({ goBack }: TransactionProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    // navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="text-xl font-bold mb-2">Transaction Details</h1>
          <p className="text-sm">Validator Public Key</p>
          <div
            onClick={copyToClipboard}
            className="text-xs flex justify-between items-center gap-2 mt-1 py-4 px-2 bg-gray-950 rounded-[8px]"
          >
            <span>
              0xa61ffd0c41b28e12b3ce64b85193cd31630505699bf5637b94c998
            </span>
            {copied ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Selected Operators</h2>
          <Operator name="ChainUp @" id="25" ssv={0.0} days={182} />
          <Operator name="Lido - Maria @" id="29" ssv={0.0} days={182} />
          <Operator name="Lido - Stakely @" id="30" ssv={0.0} days={182} />
          <Operator name="Lido - Openbitiab @" id="37" ssv={0.0} days={182} />
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
            <span>0.0 SSV</span>
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
            <span>0.5 SSV</span>
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
            <span>1.5 SSV</span>
          </div>
        </div>
        <div className="flex justify-center p-4 gap-4">
          <button
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
    </div>
  );
};

export default Tx;
