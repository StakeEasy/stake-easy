// pages/api/addWalletAddress.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = process.env.MONGO_URL as string; // Your MongoDB connection string
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    console.log(address, "added to database");

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    await client.connect();
    const database = client.db('StakeEasyApp'); // Replace with your database name
    const collection = database.collection('StakeEasyData'); // Replace with your collection name

    // Insert or update the document with the new wallet address
    const query = { WalletAddress: address };
    const update = {
      $set: { WalletAddress: address }
    };

    const result = await collection.updateOne(query, update, { upsert: true });

    return NextResponse.json({ message: 'Wallet address added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}