import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = process.env.MONGO_URL as string; // Your MongoDB connection string
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
  try {
    console.log("API");
    const body = await req.json();
    const { walletAddress, eigenPodAddress } = body;

    console.log(`Wallet Address: ${walletAddress}, EigenPod Address: ${eigenPodAddress} added to database`);

    // Validate the input
    if (!walletAddress || !eigenPodAddress) {
      return NextResponse.json({ error: 'Wallet address and EigenPod address are required' }, { status: 400 });
    }

    await client.connect();
    const database = client.db('StakeEasyApp'); // Replace with your database name
    const collection = database.collection('StakeEasyData'); // Replace with your collection name

    // Insert or update the document with the new wallet and EigenPod address
    const query = { WalletAddress: walletAddress };
    const update = {
      $set: {
        WalletAddress: walletAddress,
        EigenPodAddress: eigenPodAddress
      }
    };

    const result = await collection.updateOne(query, update, { upsert: true });

    return NextResponse.json({ message: 'Wallet and EigenPod addresses added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}