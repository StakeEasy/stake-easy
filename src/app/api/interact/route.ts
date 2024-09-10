// import { ethers } from 'ethers';
// import type { NextApiRequest, NextApiResponse } from 'next';

// // Define the ABI of your contract
// const contractABI = [
//   {
//     inputs: [
//       { internalType: 'address', name: '_logic', type: 'address' },
//       { internalType: 'bytes', name: '_data', type: 'bytes' },
//     ],
//     stateMutability: 'payable',
//     type: 'constructor',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: false, internalType: 'address', name: 'previousAdmin', type: 'address' },
//       { indexed: false, internalType: 'address', name: 'newAdmin', type: 'address' },
//     ],
//     name: 'AdminChanged',
//     type: 'event',
//   },
//   { 
//     anonymous: false, 
//     inputs: [{ indexed: true, internalType: 'address', name: 'beacon', type: 'address' }],
//     name: 'BeaconUpgraded', 
//     type: 'event' 
//   },
//   { 
//     anonymous: false, 
//     inputs: [{ indexed: true, internalType: 'address', name: 'implementation', type: 'address' }],
//     name: 'Upgraded', 
//     type: 'event' 
//   },
//   { stateMutability: 'payable', type: 'fallback' },
//   { stateMutability: 'payable', type: 'receive' },
// ];

// // Define the contract address
// const contractAddress = "0x38A4794cCEd47d3baf7370CcC43B560D3a1beEFA";

// // Create a provider
// const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);

// // Create a signer
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

// // Create a contract instance
// const contract = new ethers.Contract(contractAddress, contractABI, signer);

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { functionName, args }: { functionName: string, args: any[] } = req.body;

//       if (!contract.functions[functionName]) {
//         return res.status(400).json({ error: 'Function does not exist on the contract' });
//       }

//       const transaction = await contract[functionName](...args);
//       const receipt = await transaction.wait();

//       res.status(200).json({
//         success: true,
//         transactionHash: receipt.transactionHash,
//         blockNumber: receipt.blockNumber,
//       });
//     } catch (error: any) {
//       console.error('Error:', error);
//       res.status(500).json({ error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }