"use client";
import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Image } from "next/image";

const ClusterDashboard: React.FC = () => {
  const router = useRouter();

  const handleValidatorDashboard = () => {
    router.push("/my-account/validator-dashboard");
  };

  const goBack = () => {
    router.push("/join/success");
  };

  const handleAddCluster = () => {
    router.push("/join");
  }

  return (
    <div
      className="mb-[500px] mx-44 p-6"
      style={{
        background: "linear-gradient(274.46deg, #1D1D1D 3.75%, #191919 95.45%)",
        boxShadow: "0px 3.18px 42.01px 0px rgba(0, 0, 0, 0.25)",
        border: "0.4px solid #A6A6A6",
        borderRadius: "27px",
      }}
    >
      <button onClick={goBack} className="flex items-center mb-4 text-white ">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <div className="flex justify-between items-center mb-4 pl-[0.8rem] pr-[1.5rem]">
        <h1 className="text-2xl font-bold text-white">Validator Clusters</h1>
        <div className="flex space-x-4">
          {/* <button
            className="text-white px-4 py-2 rounded-lg flex items-center"
            style={{
              border: "1px solid transparent",
              borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
              borderImageSlice: 1,
              background: "linear-gradient(to right, #DA619C, #FF844A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fee Address
          </button> */}
          <button
            className="text-white px-4 py-2 rounded-lg"
            style={{
              border: "1px solid transparent",
              borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
              borderImageSlice: 1,
              background: "linear-gradient(to right, #DA619C, #FF844A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            onClick={handleAddCluster}
          >
            Add Cluster +
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-lg p-4"
        style={{
          background:
            "linear-gradient(344.04deg, #1D1D1D 24.05%, #0F0F0F 92.03%)",
          // border: "0.4px solid #A6A6A6",
          borderRadius: "15px",
        }}
      >
        {/* Table Header */}
        <div className="flex text-gray-400 mb-4">
          <div className="flex-1">Cluster ID</div>
          <div className="flex-1">Operators</div>
          <div className="flex-1">Validators</div>
          <div className="flex-1">Est Operational Runway</div>
          <div className="w-16"></div>
        </div>

        {/* Table Row */}
        <div
          className="flex items-center text-white rounded-lg p-4 hover:bg-gray-700 transition duration-300 hover:cursor-pointer"
          onClick={handleValidatorDashboard}
          style={{
            background:
              "linear-gradient(344.04deg, #1D1D1D 24.05%, #0F0F0F 92.03%)",
            border: "0.4px solid #A6A6A6",
            borderRadius: "15px",
          }}
        >
          <div className="flex-1 truncate">6040...7c3e</div>
          <div className="flex-1 flex space-x-2">
            {/* Icons for operators */}
            <img
              src="/icons/operator1.svg"
              alt="Operator 1"
              className="h-6 w-6"
            />
            <img
              src="/icons/operator2.svg"
              alt="Operator 2"
              className="h-6 w-6"
            />
            <img
              src="/icons/operator3.svg"
              alt="Operator 3"
              className="h-6 w-6"
            />
            <img
              src="/icons/operator4.svg"
              alt="Operator 4"
              className="h-6 w-6"
            />
          </div>
          <div className="flex-1">1</div>
          <div className="flex-1">182 Days</div>
          <div className="w-16 flex justify-center p-2 bg-[#FC8151] rounded-full">
            <button className="text-gray-400 hover:text-white animate-bounce-custom shadow-orange-glow">
              <ArrowRight color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterDashboard;
