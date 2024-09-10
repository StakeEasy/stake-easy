"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import OperatorCard from "./OperatorCard";
import { Copy, Info, CheckCircle, ArrowLeft } from "lucide-react";
import { Tooltip, Carousel } from "antd";

interface Operator {
  id: number;
  name: string;
  performance: {
    '24h': number;
    '30d': number;
  };
  status: string;
}

interface Validator {
  public_key: string;
  status: string;
}

interface ClusterData {
  operators: Operator[];
  validators: Validator[];
}

const ValidatorDashboard: React.FC = () => {
  const [clusterData, setClusterData] = useState<ClusterData | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const clusterId = searchParams.get('clusterId');
  const balance = searchParams.get('balance');

  useEffect(() => {
    const fetchClusterData = async () => {
      if (!clusterId) {
        console.error('No cluster ID provided');
        return;
      }

      try {
        const response = await fetch(`https://api.ssv.network/api/v4/holesky/clusters/hash/${clusterId}?page=1&perPage=10`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ClusterData = await response.json();
        setClusterData(data);
      } catch (error) {
        console.error('Error fetching cluster data:', error);
      }
    };

    fetchClusterData();
  }, [clusterId]);

  const itemsPerPage = 4;
  const pages = clusterData ? Math.ceil(clusterData.operators.length / itemsPerPage) : 0;

  const slides = [];
  if (clusterData) {
    for (let i = 0; i < pages; i++) {
      const startIndex = i * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentItems = clusterData.operators.slice(startIndex, endIndex);

      slides.push(
        <div key={i}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {currentItems.map((operator) => (
              <OperatorCard 
                key={operator.id}
                name={operator.name}
                id={operator.id}
                status={operator.status}
                performance={operator.performance['24h'].toFixed(2) + '%'}
                fee="0.0 SSV"
              />
            ))}
          </div>
        </div>
      );
    }
  }

  const copyToClipboard = () => {
    if (clusterData && clusterData.validators[0]) {
      navigator.clipboard.writeText(clusterData.validators[0].public_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const goBack = () => {
    router.push("/my-account/clusters-dashboard");
  };

  if (!clusterData) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <>
      <div className="main">
        <div className="flex items-center justify-center p-8">
          <div className="p-6 rounded-lg text-white w-full max-w-7xl">
            <button
              onClick={goBack}
              className="flex items-center mb-4 text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="mb-6 flex">
              <h2
                className="text-xl font-semibold"
                style={{ letterSpacing: "1px", fontSize: "20px" }}
              >
                Cluster | <span style={{ fontSize: "12px" }}>{clusterId}</span>
              </h2>
            </div>

            <Carousel dots={true} arrows className="carousel mb-2">
              {slides}
            </Carousel>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Balance Card */}
              <div
                className="rounded-lg shadow-md"
                style={{
                  border: "1px solid #A6A6A6",
                  borderRadius: "10px",
                  color: "white",
                  background: "linear-gradient(to right, #171717, #252525)",
                }}
                >
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Balance</h3>
                  <p>{balance ? `${(parseFloat(balance) / 1e18).toFixed(4)} ETH` : "Loading..."}</p>
                </div>
              
                {/* Balance card content remains the same */}
              </div>

              {/* Validators Card */}
              <div
                className="md:col-span-2 bg-gray-700 p-4 rounded-lg shadow-md"
                style={{
                  border: "1px solid #A6A6A6",
                  borderRadius: "10px",
                  color: "white",
                  background: "linear-gradient(to right, #171717, #252525)",
                }}
              >
                <div className="flex justify-between items-center">
                  <h3
                    className="text-xl font-semibold"
                    style={{ letterSpacing: "1px" }}
                  >
                    Validators
                  </h3>
                </div>
                <div
                  className="bg-gray-800 m-2 mt-7"
                  style={{
                    border: "1px solid #A6A6A6",
                    borderRadius: "10px",
                    background: "linear-gradient(to right, #1d1d1d, #0f0f0f)",
                  }}
                >
                  <div className="flex justify-between items-center p-4">
                    <p className="text-sm">Public Key</p>
                    <div className="text-xs flex items-center">
                      <span className="mr-1 text-sm font-semibold">Status</span>
                      <Tooltip
                        title="Refers to the validator's status in the SSV network (not beacon chain), and reflects whether its operators are consistently performing their duties (according to the last 2 epochs)"
                        color="#121212"
                        overlayInnerStyle={{
                          border: "1px solid transparent",
                          borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                          borderImageSlice: 1,
                          fontSize: "12px",
                        }}
                      >
                        <Info size={10} />
                      </Tooltip>
                    </div>
                  </div>
                  <div style={{ borderBottom: "1px solid #A6A6A6" }}></div>

                  <div className="flex justify-between items-center p-3">
                    <div className="text-xs flex items-center">
                      <span className="mr-2 text-sm font-semibold">
                        {clusterData.validators[0].public_key.slice(0, 8)}...{clusterData.validators[0].public_key.slice(-6)}
                      </span>

                      <button
                        className={`text-[#FC8150] transition-colors ${
                          copied ? "text-[#FC8150]" : ""
                        }`}
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className={`text-xs ${clusterData.validators[0].status === 'Active' ? 'text-green-500 bg-[#D5F5E3]' : 'text-red-500 bg-[#FADBD8]'} rounded-[5px] p-[5px]`}>
                      {clusterData.validators[0].status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ValidatorDashboard;