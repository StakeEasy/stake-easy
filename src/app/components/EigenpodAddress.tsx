import React, { useState, useEffect } from "react";
import { ClipboardCopy, CheckCircle } from "lucide-react";
import { useAccount } from 'wagmi';
import { Contract, ethers } from 'ethers';
import eigenPodManagerAbi from '../../../abi.json';

interface WindowWithEthereum extends Window {
  ethereum?: any;
}

declare let window: WindowWithEthereum;

const EigenpodAddress: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [contract, setContract] = useState<Contract | null>(null);
  const [podAddress, setPodAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("EigenPod Address not created yet");

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
        eigenPodManagerAbi,
        signer
      );
      setContract(contractInstance);
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      // Reset current address if no wallet is connected
      setCurrentAddress("");
    } else if (podAddress) {
      setCurrentAddress(podAddress);
    }
  }, [isConnected, podAddress]);

  const checkPodExists = async (): Promise<boolean> => {
    if (!contract || !address) {
      console.error('Contract or address not available');
      return false;
    }

    try {
      console.log('Checking if pod exists...');
      const podExists = await contract.hasPod(address);
      console.log("Pod exists:", podExists);
      return podExists;
    } catch (error) {
      console.error('Error checking if pod exists:', error);
      return false;
    }
  };


  const getPodAddress = async (): Promise<string | null> => {
    console.log("getPodAddress called"); 
    if (!contract || !address) {
      console.error('Contract or address not available');
      return null;
    }
  
    try {
      console.log('Checking if pod exists...');
      const podExists = await contract.hasPod(address);
      console.log("Pod exists:", podExists);
  
      if (podExists) {
        const existingPod = await contract.getPod(address);
        console.log("Pod address:", existingPod);
        setPodAddress(existingPod);
        return existingPod;
      } else {
        console.log("Pod does not exist."); 
        return null;
      }
    } catch (error) {
      console.error('Error retrieving pod information:', error);
      return null;
    }
  };

  const createPod = async (): Promise<string | null> => {
    if (!contract) {
      console.error('Contract not available');
      return null;
    }

    try {
      console.log('Checking if pod already exists...');
      console.log("Address: ", address);
      const podExists = await contract.hasPod(address);

      if (podExists) {
        const existingPod = await contract.getPod(address);
        alert(`Pod is already created! Pod address: ${existingPod}`);
        console.log('Existing EigenPod address:', existingPod);
        setPodAddress(existingPod);
        return existingPod;
      }

      console.log('Creating pod...');
      const tx = await contract.createPod();
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);

      // Get the new pod address
      const newPodAddress = await contract.getPod(address);
      console.log('Your EigenPod address:', newPodAddress);

      alert(`Pod created successfully! Pod address: ${newPodAddress}`);
      setPodAddress(newPodAddress);
      return newPodAddress;
    } catch (error) {
      console.error('Error creating EigenPod:', error);
      alert('Error creating EigenPod. Check the console for details.');
      return null;
    }
  };

  const saveAddresses = async (walletAddress: string | undefined, eigenPodAddress: string) => {
    try {
      console.log("FETCHING...")
      const response = await fetch('/api/storeAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, eigenPodAddress }),
      });
  
      if (!response.ok) {
        console.error('Failed to store addresses:', response.statusText);
        alert('Error storing addresses.');
      } else {
        console.log('Addresses stored successfully.');
      }
    } catch (error) {
      console.error('Error in storing addresses:', error);
      alert('Error in storing addresses.');
    }
  };
  
  const handleCreatePodAddress = async () => {
    setLoading(true);
    const newPodAddress = await createPod();
    if (newPodAddress) {
      await saveAddresses(address, newPodAddress);
    }
    setLoading(false);
  };
  

 const handleGetPodAddress = async () => {
  console.log("handleGetPodAddress called");
  const existingAddress = await getPodAddress();
  console.log("Existing address:", existingAddress); 
  
  if (existingAddress) {
    console.log("Calling API call function");
    await saveAddresses(address, existingAddress);
    alert(`Current EigenPod Address: ${existingAddress}`);
  } else {
    console.log("No EigenPod Address found.");
    alert("No EigenPod Address found.");
  }
};

  
  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 mx-auto transition-all duration-300 hover:shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-500 mb-6">
            EigenPod Address Creation
          </h2>

          <p className="text-gray-600 leading-relaxed">
            This tool allows you to programmatically generate an EigenPod
            address, making the setup process easier and more convenient.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              EigenPod Address
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                value={currentAddress}
                readOnly
                className="flex-grow bg-transparent px-4 py-3 text-gray-800 focus:outline-none"
              />
              <button
                className={`p-3 text-gray-500 hover:text-gray-700 transition-colors ${
                  copied ? "text-green-500" : ""
                }`}
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <ClipboardCopy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleCreatePodAddress}
              disabled={loading || !isConnected}
              className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-sm transition-all duration-300 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Pod Address"}
            </button>
            <button
              onClick={handleGetPodAddress}
              disabled={!isConnected}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-sm transition-all duration-300"
            >
              Get Pod Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EigenpodAddress;