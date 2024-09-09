import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';
import contractABI from '../../utils/ssvNetworkABI.json';

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = provider.getSigner();

// Create a contract instance
const contract = new ethers.Contract(process.env.SSV_NETWORK_CONTRACT_ADDRESS as string, contractABI, signer);

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