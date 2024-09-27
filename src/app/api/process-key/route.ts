import { NextRequest, NextResponse } from 'next/server';
import { SSVKeys, KeyShares, KeySharesItem } from 'ssv-keys';
import { NonceScanner } from 'ssv-scanner';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keystoreFile, password, operatorsData, ownerAddress } = body;

    if (!keystoreFile || !password || !operatorsData || !ownerAddress) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const params = {
      network: "holesky",
      nodeUrl: `${process.env.NEXT_PUBLIC_NODE_URL}`,
      ownerAddress: ownerAddress,
    };

    const nonceScanner = new NonceScanner(params);
    const ownerNonce = await nonceScanner.run();

    console.log('Starting keystore processing...');

    const ssvKeys = new SSVKeys();
    const keyShares = new KeyShares();
    const keySharesItem = new KeySharesItem();

    console.log('Extracting keys from keystore...');
    const { publicKey, privateKey } = await ssvKeys.extractKeys(keystoreFile, password);


    const operators = operatorsData.map((operator: { id: any; address: any; }) => ({
      id: operator.id,
      operatorKey: operator.address,
    }));

    console.log('Building shares with operators...');
    const encryptedShares = await ssvKeys.buildShares(privateKey, operators);
    console.log('Shares built successfully.');

    console.log('Building payload...');
    const payload = await keySharesItem.buildPayload(
      { publicKey, operators, encryptedShares },
      { ownerAddress, ownerNonce, privateKey }
    );
    console.log('Payload:', payload);

    console.log('Payload built successfully.');

    return NextResponse.json({ payload }, { status: 200 });
  } catch (error) {
    console.error('Error processing keystore:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}