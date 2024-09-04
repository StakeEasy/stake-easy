import { NextRequest, NextResponse } from 'next/server';
import { SSVKeys, KeyShares, KeySharesItem } from 'ssv-keys';
import operatorKeys from '../../utils/operators.json';
import operatorIds from '../../utils/operatorIds.json';

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keystoreFile, password } = body;

    if (!keystoreFile || !password) {
      return NextResponse.json({ message: 'Missing keystore file or password' }, { status: 400 });
    }

    console.log('Starting keystore processing...');

    const ssvKeys = new SSVKeys();
    const keyShares = new KeyShares();
    const keySharesItem = new KeySharesItem();

    console.log('Extracting keys from keystore...');
    const { publicKey, privateKey } = await ssvKeys.extractKeys(keystoreFile, password);

    console.log('Keys extracted:', { publicKey, privateKey });

    const operators = operatorKeys.map((operator, index) => ({
      id: operatorIds[index],
      operatorKey: operator,
    }));

    console.log('Building shares with operators...');
    const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

    console.log('Shares built successfully.');

    const TEST_OWNER_NONCE = 1;
    const TEST_OWNER_ADDRESS = '0x81592c3de184a3e2c0dcb5a261bc107bfa91f494';

    console.log('Building payload...');
    const payload = await keySharesItem.buildPayload(
      { publicKey, operators, encryptedShares },
      { ownerAddress: TEST_OWNER_ADDRESS, ownerNonce: TEST_OWNER_NONCE, privateKey }
    );

    console.log('Payload built:', payload);

    keySharesItem.update({
      ownerAddress: TEST_OWNER_ADDRESS,
      ownerNonce: TEST_OWNER_NONCE,
      operators,
      publicKey
    });

    keyShares.add(keySharesItem);

    console.log('KeyShares ready.');

    return NextResponse.json({
      payload,
      keyShares: keyShares.toJson(),
    });
  } catch (e) {
    console.error('Error processing keystore:', e);
    return NextResponse.json({ message: (e as Error).message }, { status: 500 });
  }
}