"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import TransactionDetails from "./TransactionDetails";
import { Tooltip } from "antd";
import { Info } from "lucide-react";

interface SelectTimeProps {
  goBack: () => void;
  parsedPayload: any;
  operatorsData: any;
  totalFee: number;
}

const StakingInterface = ({ goBack, parsedPayload, operatorsData, totalFee }: SelectTimeProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [customPeriod, setCustomPeriod] = useState<number | string>(0);
  const [showTxDetails, setShowTxDetails] = useState(false);
  const [netFee, setNetFee] = useState(0);
  const [nDays, setNDays] = useState(0);

  useEffect(() => {
    if (selectedPeriod === "6 Months") {
      setNetFee(0.5);
      setNDays(182);
    } else if (selectedPeriod === "1 Year") {
      setNetFee(1);
      setNDays(365);
    } else if (selectedPeriod === "Custom Period" && customPeriod) {
      setNetFee(Number(((Number(customPeriod) / 365) * 1).toFixed(5)));
      setNDays(Number(customPeriod));
    } else {
      setNetFee(0);
      setNDays(0);
    }
  }, [selectedPeriod, customPeriod]);

  const handleCustomPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/^0+/, "");
    setCustomPeriod(sanitizedValue ? Number(sanitizedValue) : "");
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (period !== "Custom Period") {
      setCustomPeriod(""); // Reset custom period input when other options are selected
    }
  };

  const handleTxDeatils = () => {
    setShowTxDetails(true);
  };

  const goBackToTransactionDetails = () => {
    setShowTxDetails(false);
  };

  // const getNetworkFee = () => {
  //   if (selectedPeriod === "6 Months") {
  //     setNetFee(0.5);
  //     setNDays(182);
  //   } else if (selectedPeriod === "1 Year") {
  //     setNetFee(1);
  //     setNDays(365);
  //   } else {
  //     setNetFee(Number(((Number(customPeriod) / 365) * 1).toFixed(5)));
  //     setNDays(Number(customPeriod));  
  //   }
  //   // console.log("netFee: ", netFee);
  //   // console.log("nDays: ", nDays);
  //   return netFee;
  // };

  const handleRowClick = (period: string) => {
    if (selectedPeriod === period) {
      // Unselect if the same period is clicked
      setSelectedPeriod("");
    } else {
      // Select the clicked period
      setSelectedPeriod(period);
    }
  };

  if (showTxDetails) {
    // console.log("netFee: ", netFee);
    // console.log("nDays: ", nDays);
    return <TransactionDetails goBack={goBackToTransactionDetails} parsedPayload={parsedPayload} operatorsData={operatorsData}  totalFee={totalFee} networkFee={netFee} noDays={nDays}/>;
  }

  return (
    <div className="max-w-lg mx-auto text-white shadow-md rounded-lg border-2 border-gray-200 p-6">
      <button onClick={goBack} className="flex items-center mb-4 text-white ">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <h2
        className="text-2xl font-bold mb-4"
        style={{
          background: "linear-gradient(to right, #DA619C, #FF844A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Select your validator funding period
      </h2>
      <p className="mb-4">
        The SSV amount you deposit will determine your validator operational
        runway. (You can always manage it later by withdrawing or depositing
        more funds).
      </p>

      <div className="space-y-4">
        <div
          className="flex justify-between items-center border-2 border-gray-300 p-2 rounded-[8px] cursor-pointer"
          onClick={() => handleRowClick("6 Months")}
        >
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedPeriod === "6 Months"}
              onChange={() => handlePeriodChange("6 Months")}
              className="mr-2 custom-checkbox"
            />
            <span>6 Months</span>
          </label>
          <span className="font-bold">0.5 SSV</span>
        </div>
        <div
          className="flex justify-between items-center border-2 border-gray-300 p-2 rounded-[8px] cursor-pointer"
          onClick={() => handleRowClick("1 Year")}
        >
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedPeriod === "1 Year"}
              onChange={() => handlePeriodChange("1 Year")}
              className="mr-2 custom-checkbox"
            />
            <span>1 Year</span>
          </label>
          <span className="font-bold">1 SSV</span>
        </div>
        <div
          className="flex justify-between items-center border-2 border-gray-300 p-2 rounded-[8px] cursor-pointer"
          onClick={() => handleRowClick("Custom Period")}
        >
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedPeriod === "Custom Period"}
              onChange={() => handlePeriodChange("Custom Period")}
              className="mr-2 custom-checkbox"
            />
            <span className="cursor-pointer">Custom Period</span>
          </label>
          <input
            type="number"
            value={customPeriod}
            onChange={handleCustomPeriodChange}
            className="border p-2 rounded w-24 text-white bg-[#161515]"
          />
          <span className="ml-0 pl-0">days</span>
          <span className="font-bold">
            {Number((Number(customPeriod) / 365) * 1).toFixed(5)} SSV
          </span>
        </div>
      </div>

      <div className="w-[calc(100%+48px)] border-b-2 border-gray-400 mt-4 -ml-6"></div>

      <h3
        className="text-xl font-bold mt-3"
        style={{
          background: "rgba(252, 129, 81, 1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Funding Summary
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="flex items-center ">
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
          <span>{totalFee}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center ">
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
          <span>{netFee} SSV</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center ">
            Liquidation collateral{" "}
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
          <span>1 SSV</span>
        </div>
        <div className="w-[calc(100%+48px)] border-b-2 border-gray-400 mt-4 -ml-6"></div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span className="">
            {totalFee +
              1 +
              (selectedPeriod === "Custom Period"
                ? Number(((Number(customPeriod) / 365) * 1).toFixed(5))
                : selectedPeriod === "6 Months"
                ? 0.5
                : selectedPeriod === "1 Year"
                ? 1
                : 0)}{" "}
            SSV
          </span>
        </div>
      </div>

      <button
        onClick={handleTxDeatils}
        style={{
          border: "1px solid transparent",
          borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
          borderImageSlice: 1,
          background: "linear-gradient(to right, #DA619C, #FF844A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        className="font-bold mt-4 w-full text-white py-[6px] px-4 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-orange-600 focus:ring-opacity-50"
      >
        Next
      </button>

      <style jsx>{`
        .custom-checkbox {
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: black;
          border: 2px solid transparent;
          background-image: linear-gradient(black, black),
            linear-gradient(90deg, orange, purple);
          background-origin: border-box;
          background-clip: content-box, border-box;
          position: relative;
          transition: background 0.3s ease-in-out;
        }

        .custom-checkbox:checked {
          background-image: linear-gradient(black, black),
            linear-gradient(90deg, orange, purple);
          background-clip: content-box, border-box;
        }

        .custom-checkbox:checked::before {
          content: "✔";
          color: white;
          position: absolute;
          font-size: 16px;
          line-height: 20px;
          text-align: center;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  );
};

export default StakingInterface;
