import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';

// Define the ABI of your contract
const contractABI = [
  {
    inputs: [
      { internalType: 'address', name: '_logic', type: 'address' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    stateMutability: 'payable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'previousAdmin', type: 'address' },
      { indexed: false, internalType: 'address', name: 'newAdmin', type: 'address' },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'beacon', type: 'address' }],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'implementation', type: 'address' }],
    name: 'Upgraded',
    type: 'event',
  },
  { stateMutability: 'payable', type: 'fallback' },
  { stateMutability: 'payable', type: 'receive' },
];

// Define the contract address
const contractAddress = "0x38A4794cCEd47d3baf7370CcC43B560D3a1beEFA";

// Create a provider
interface WindowWithEthereum extends Window {
  ethereum?: any;
}
declare let window: WindowWithEthereum;

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { functionName, args }: { functionName: string, args: any[] } = body;

    // Check if the function exists directly on the contract
    if (typeof contract[functionName] !== 'function') {
      return NextResponse.json({ error: 'Function does not exist on the contract' }, { status: 400 });
    }

    // Call the contract function
    const transaction = await contract[functionName](...args);

    // Wait for the transaction to be mined
    const receipt = await transaction.wait();

    return NextResponse.json({
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}