'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const GreetingAtDashboard = () => {

  const router = useRouter();

  const handleClusterDashboard = () => {
      router.push("/my-account/clusters-dashboard");
  }

  return (
    <div className="flex items-center justify-center">
      <div className="p-12 rounded-lg max-w-lg w-full text-white"
      style={{
        borderRadius: "35px",
        color: "white",
        boxShadow: "0px 4px 52.9px 0px rgba(0, 0, 0, 0.25)",
        // background: "linear-gradient(to right, #171717, #252525)",
      }}>
        <h2 className="text-2xl font-medium mb-4">Welcome to the SSV Network!</h2>
        <p className="mb-4 text-base font-light">
          Your new validator is managed by the following cluster:
        </p>
        <div className="p-4 rounded-lg mb-4"
        style={{
          borderRadius: "14px",
          background: "rgba(23, 23, 23, 1)",
        }}>
          <p className="font-extralight mb-2">Validator Cluster 6040...7c3e</p>
          <div className="flex space-x-4 justify-center">
            {/* Replace these with real images if necessary */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full mb-2"
              style={{
                background: "rgba(217, 217, 217, 1)",
              }}></div>
              <span className="text-sm">Operator 1</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full mb-2"
              style={{
                background: "rgba(217, 217, 217, 1)",
              }}></div>
              <span className="text-sm">Operator 2</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full mb-2"
              style={{
                background: "rgba(217, 217, 217, 1)",
              }}></div>
              <span className="text-sm">Operator 3</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full mb-2"
              style={{
                background: "rgba(217, 217, 217, 1)",
              }}></div>
              <span className="text-sm">Operator 4</span>
            </div>
          </div>
        </div>
        <p className="mb-4 font-light">
          Your cluster operators have been notified and will start your validator operation instantly.
        </p>
        <div className="mt-6 flex justify-center w-full">
          <button className="w-full text-white py-2 px-4 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-opacity-50"
          style={{
            border: "1px solid transparent",
            borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
            borderImageSlice: 1,
            background: "linear-gradient(to right, #DA619C, #FF844A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          onClick={handleClusterDashboard}>
            Manage Cluster
          </button>
        </div>
      </div>
    </div>
  );
}

export default GreetingAtDashboard;
