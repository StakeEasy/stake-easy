"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import OperatorCard from "./OperatorCard";
import { BrowserProvider, Contract, ethers, parseEther, formatEther, parseUnits } from "ethers";

//import { parseEther } from "ethers/lib/utils";
import { Copy, Info, CheckCircle, ArrowLeft, ChartNoAxesCombined } from "lucide-react";
import { Tooltip, Carousel, Modal, Input, Button } from "antd";
import contractABI from '../utils/ssvNetworkABI.json';
import { toast, Toaster } from 'react-hot-toast';
const contractAddress = "0x5Dbf9a62BbcC8135AF60912A8B0212a73e4a6629";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const clusterId = searchParams.get('clusterId');
  const initialBalance = searchParams.get('balance');

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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cluster data:', error);
      }
    };

    fetchClusterData();
  }, [clusterId]);

  useEffect(() => {
    // Initialize balance from searchParams
    setBalance(initialBalance || '0');
  }, [initialBalance]);

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
                // fee="0.0 SSV"
              />
            ))}
          </div>
        </div>
      );
    }
  }

  const showDepositModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeposit = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to continue.');
      return;
    }
  
    if (!clusterData) {
      alert('Cluster data is not loaded.');
      return;
    }
  
    const operatorIDs = clusterData.operators.map(op => op.id); 
    const clusterOwner = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0]; // Get connected wallet address
  
    // Create a cluster object that matches the ABI's structure
    const clusterObject = {
      validatorCount: clusterData.validators.length, // Or another value based on your cluster data
      networkFeeIndex: 0, // Use actual data from your cluster if available
      index: 0, // Use actual data from your cluster if available
      active: true, // Use actual data from your cluster if available
      balance: parseEther(balance || '0'), // Use the balance from the searchParams
    };
  
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);
  
      const tx = await contract.deposit(
        clusterOwner,               // address clusterOwner
        operatorIDs,                // uint64[] operatorIds
        parseEther(amount),         // uint256 amount
        clusterObject               // ISSVNetworkCore.Cluster cluster
      );
  
      await tx.wait();
      console.log('Deposit successful');
      setBalance((prevBalance) => {
        const newBalance = parseFloat(prevBalance) + parseFloat(amount);
        return formatEther(parseUnits(newBalance.toString(), 'ether'));
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error during deposit:', error);
      alert('An error occurred during the deposit. Please check the console for details.');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

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

  // if (!clusterData) {
  //   return <div className="text-white">Loading...</div>;
  // }

  if (loading) {
    return (
      <div className="main">
        <div className="flex items-center justify-center p-8">
          <div
            className="p-6 rounded-lg text-white w-full max-w-7xl"
            style={{
              background: "linear-gradient(to right, #1D1D1D 0%, #191919 100%)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "30px 40px",
              borderRadius: "20px",
            }}
          >
            <div className="flex items-center mb-4 text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <div className="w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="mb-6 flex">
              <div className="w-48 h-7 bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Operator Cards Skeleton */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 h-[25vh] p-4 rounded-lg shadow-md flex flex-col justify-between"
                    style={{
                      border: "1px solid #A6A6A6",
                      borderRadius: "10px",
                      background: "linear-gradient(to right, #1d1d1d, #0f0f0f)",
                    }}
                  >
                    <div className="flex flex-col mb-4">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 bg-gray-700 rounded-full mr-2 animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="w-24 h-5 bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between gap-2">
                      <div className="flex flex-col justify-between gap-[20px]">
                        <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
                      </div>
                      <div className="flex flex-col justify-between gap-[20px]">
                        <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
                      </div>
                      <div className="flex flex-col justify-between gap-[20px]">
                        <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <div className="w-16 h-2 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Balance & Validators Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Balance Card Skeleton */}
              <div
                className="rounded-lg shadow-md"
                style={{
                  border: "1px solid #A6A6A6",
                  borderRadius: "10px",
                  color: "white",
                  background: "linear-gradient(to right, #171717, #252525)",
                }}
              >
                <div className="p-5">
                  <div className="w-24 h-4 bg-gray-700 rounded mb-3 animate-pulse"></div>
                  <div className="w-32 h-6 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div style={{ borderBottom: "1px solid #A6A6A6" }}></div>
                <div className="text-xs flex items-center p-4">
                  <div className="w-40 h-4 bg-gray-700 rounded mr-1 animate-pulse"></div>
                  <Info size={10} />
                </div>
                <div className="w-24 h-6 bg-gray-700 rounded ml-4 mb-4 animate-pulse"></div>
                <div className="flex justify-between gap-4 p-4">
                  <div className="w-20 h-8 flex-1 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-20 h-8 flex-1 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Validators Card Skeleton */}
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
                  <div className="w-32 h-6 bg-gray-800 rounded animate-pulse"></div>
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
                    <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div style={{ borderBottom: "1px solid #A6A6A6" }}></div>
                  <div className="flex justify-between items-center p-3">
                    <div className="w-40 h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="main">
        <div className="flex items-center justify-center p-8">
          <div
              className=" p-6 rounded-lg  text-white w-full max-w-7xl"
              style={{
                background: "linear-gradient(to right, #1D1D1D 0%, #191919 100%)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "30px 40px",
                borderRadius: "20px",
              }}
            >
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
                <div className=" p-5">
                  <h3 className="text-sm font-semibold text-[#A6A6A6] mb-3">
                    Balance
                  </h3>
                  <p className="text-md font-bold">{balance ? `${(parseFloat(balance) / 1e18).toFixed(4)} SSV` : "Loading..."}</p>
                </div>
                <div style={{ borderBottom: "1px solid #A6A6A6" }}></div>
                {/* <div className="text-xs flex items-center p-4">
                  <span className="mr-1 text-sm font-semibold ">
                    Est. Operational Runway
                  </span>
                  <Tooltip
                    title="Estimated amount of days the cluster balance is sufficient to run all it’s validators"
                    color="#121212"
                    overlayInnerStyle={{
                      border: "1px solid transparent",
                      borderImage:
                        "linear-gradient(to right, #A257EC , #DA619C )",
                      borderImageSlice: 1,
                      fontSize: "12px",
                    }}
                  >
                    <Info size={10} />
                  </Tooltip>
                </div>
                <p className="text-md font-bold p-4 pt-0">
                  182 <span className="text-[#A6A6A6] font-[300] ">days</span>
                </p> */}
                <div className="flex justify-between p-4 gap-4">
                  <button
                    className="flex-1 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
                    onClick={showDepositModal}
                    style={{
                      border: "1px solid transparent",
                      borderImage:
                        "linear-gradient(to right, #DA619C , #FF844A )",
                      borderImageSlice: 1,
                      background: "linear-gradient(to right, #DA619C, #FF844A)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Deposit
                  </button>
                  <button
                    className="flex-1 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none"
                    onClick={() => toast.error('Withdrawal feature is not available yet.')}
                    style={{
                      border: "1px solid transparent",
                      borderImage:
                        "linear-gradient(to right, #DA619C , #FF844A )",
                      borderImageSlice: 1,
                      background: "linear-gradient(to right, #DA619C, #FF844A)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Withdraw
                  </button>
                </div>
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
                    <div className={`ml-[-72px] text-xs ${clusterData.validators[0].status === 'Active' ? 'text-green-500 bg-[#D5F5E3]' : 'text-red-500 bg-[#FADBD8]'} rounded-[5px] p-[5px]`}>
                      {clusterData.validators[0].status}
                    </div>
                    <div>
                      <a href={`https://holesky.beaconcha.in/validator/${clusterData.validators[0].public_key}`} target="_blank">
                        <ChartNoAxesCombined size={25} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
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
      <Modal
        title="Deposit Amount"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleDeposit}>
            Deposit
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter amount"
          value={amount}
          onChange={handleAmountChange}
          type="number"
          min="0"
          step="any"
        />
      </Modal>
    </>
  );
};

export default ValidatorDashboard;