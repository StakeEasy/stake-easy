"use client";
import React, { useState } from "react";
import TransactionDetails from "./TransactionDetails";

const StakingInterface: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [customPeriod, setCustomPeriod] = useState<number | string>(0);
  const [showTxDetails, setShowTxDetails] = useState(false);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleCustomPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove leading zeros
    const sanitizedValue = value.replace(/^0+/, "");
    setCustomPeriod(sanitizedValue ? Number(sanitizedValue) : "");
  };

  const handleTxDeatils = () => {
    setShowTxDetails(true);
  };
  if (showTxDetails) {
    return <TransactionDetails />;
  }

  return (
    <div className="max-w-lg  mx-auto  text-white shadow-md rounded-lg border-2 border-gray-200">
      <h2 className="text-2xl font-bold mb-4">
        Select your validator funding period
      </h2>
      <p className="mb-4">
        The SSV amount you deposit will determine your validator operational
        runway. (You can always manage it later by withdrawing or depositing
        more funds).
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-2 border-gray-300 p-2 rounded-[8px]">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedPeriod === "6 Months"}
              onChange={() => handlePeriodChange("6 Months")}
              className="mr-2"
            />
            <span>6 Months</span>
          </label>
          <span className="font-bold">3.5 SSV</span>
        </div>
        <div className="flex justify-between items-center border-2 border-gray-300 p-2 rounded-[8px]">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedPeriod === "1 Year"}
              onChange={() => handlePeriodChange("1 Year")}
              className="mr-2"
            />
            <span>1 Year</span>
          </label>
          <span className="font-bold">7 SSV</span>
        </div>
        <div className="flex justify-between items-center border-2 border-gray-300 p-2 rounded-[8px]">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedPeriod === "Custom Period"}
              onChange={() => handlePeriodChange("Custom Period")}
              className="mr-2"
            />
            <span>Custom Period</span>
          </label>
          <input
            type="number"
            value={customPeriod}
            onChange={handleCustomPeriodChange}
            className="border p-2 rounded w-20"
          />
          <span className="font-bold">{Number(customPeriod) * 0.02} SSV</span>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-6">Funding Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Operator fee</span>
          <span>6 SSV</span>
        </div>
        <div className="flex justify-between">
          <span>Network fee</span>
          <span>1 SSV</span>
        </div>
        <div className="flex justify-between">
          <span>Liquidation collateral</span>
          <span>1 SSV</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{8 + Number(customPeriod) * 0.02} SSV</span>
        </div>
      </div>

      <button
        className="mt-6 w-full bg-blue-500 text-white py-2 rounded"
        onClick={handleTxDeatils}
      >
        Next
      </button>
    </div>
  );
};

export default StakingInterface;