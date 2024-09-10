"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import icon from "../assets/icon.png";
import { Tooltip } from "antd";

interface Cluster {
  id: number;
  clusterId: string;
  network: string;
  version: string;
  ownerAddress: string;
  validatorCount: number;
  networkFeeIndex: string;
  index: string;
  balance: string;
  active: boolean;
  isLiquidated: boolean;
  operators: number[];
  blockNumber: number;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

interface ApiResponse {
  pagination: {
    total: number;
    page: number;
    pages: number;
    per_page: number;
  };
  type: string;
  clusters: Cluster[];
}

const ClusterDashboard: React.FC = () => {
  const router = useRouter();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnectedAddress = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setConnectedAddress(accounts[0]);
        } catch (err) {
          console.error("Failed to get connected address:", err);
          setError("Failed to connect to wallet");
        }
      } else {
        setError("No Ethereum wallet found");
      }
    };

    fetchConnectedAddress();
  }, []);

  useEffect(() => {
    const fetchClusters = async () => {
      if (connectedAddress) {
        try {
          const response = await fetch(`https://api.ssv.network/api/v4/holesky/clusters/owner/${connectedAddress}?page=1&perPage=10`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data: ApiResponse = await response.json();
          setClusters(data.clusters);
          setLoading(false);
        } catch (err) {
          console.error("Failed to fetch clusters:", err);
          setError("Failed to fetch clusters");
          setLoading(false);
        }
      }
    };

    if (connectedAddress) {
      fetchClusters();
    }
  }, [connectedAddress]);

  const handleValidatorDashboard = () => {
    router.push("/my-account/validator-dashboard");
  };

  const goBack = () => {
    router.push("/join/success");
  };

  const handleAddCluster = () => {
    router.push("/join");
  };

  const formatBalance = (balance: string) => {
    const balanceInEth = parseFloat(balance) / 1e18;
    return balanceInEth.toFixed(4) + " ETH";
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error}</div>;

  return (
    <div
      className="mx-44 p-6"
      style={{
        background: "linear-gradient(274.46deg, #1D1D1D 3.75%, #191919 95.45%)",
        boxShadow: "0px 3.18px 42.01px 0px rgba(0, 0, 0, 0.25)",
        border: "0.4px solid #A6A6A6",
        borderRadius: "20px",
      }}
    >
      <button onClick={goBack} className="flex items-center mb-4 text-white">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <div className="flex justify-between items-center mb-4 pl-[0.8rem] pr-[1.5rem]">
        <h1
          className="text-2xl font-bold text-white"
          style={{
            background: "linear-gradient(to right, #DA619C, #FF844A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Validator Clusters
        </h1>
        <div className="flex space-x-4">
          <Tooltip
            title={"Add new set of operators"}
            color="#121212"
            placement="top"
            overlayInnerStyle={{
              border: "1px solid transparent",
              borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
              borderImageSlice: 1,
            }}
          >
            <button
              className="text-white px-4 py-2 rounded-lg transition 0.3 hover:scale-110"
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
          </Tooltip>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-lg p-4"
        style={{
          background:
            "linear-gradient(344.04deg, #1D1D1D 24.05%, #0F0F0F 92.03%)",
          borderRadius: "15px",
        }}
      >
        {/* Table Header */}
        <div className="flex text-gray-400 mb-4">
          <div className="flex-1">Cluster ID</div>
          <div className="flex-1">Operators</div>
          <div className="flex-1">Validators</div>
          <div className="flex-1">Balance</div>
          <div className="flex-1">Status</div>
          <div className="w-16"></div>
        </div>

        {/* Table Rows */}
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="flex items-center text-white rounded-lg p-4 hover:bg-gray-700 transition duration-300 hover:cursor-pointer"
            onClick={handleValidatorDashboard}
            style={{
              background:
                "linear-gradient(344.04deg, #1D1D1D 24.05%, #0F0F0F 92.03%)",
              border: "0.4px solid #A6A6A6",
              borderRadius: "15px",
            }}
          >
            <div className="flex-1 truncate">{cluster.clusterId}</div>
            <div className="flex-1 flex space-x-2">
              {cluster.operators.map((operatorId) => (
                <Image
                  key={operatorId}
                  src={icon}
                  alt={`Operator ${operatorId}`}
                  className="mb-3"
                  style={{
                    borderRadius: "20px",
                    padding: "3px",
                    border: "1px solid #A6A6A6",
                    background: "linear-gradient(to right, #1d1d1d, #191919)",
                  }}
                />
              ))}
            </div>
            <div className="flex-1">{cluster.validatorCount}</div>
            <div className="flex-1">{formatBalance(cluster.balance)}</div>
            <div className="flex-1">
              {cluster.active ? (
                <span className="text-green-500">Active</span>
              ) : (
                <span className="text-red-500">Inactive</span>
              )}
            </div>
            <div className="w-16 flex justify-center p-2 bg-[#FC8151] rounded-full">
              <button className="text-gray-400 hover:text-white animate-bounce-custom ">
                <ArrowRight color="white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClusterDashboard;