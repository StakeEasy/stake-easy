'use client'
import React, { useCallback, useState } from "react";
import { SSVKeys, KeyShares, KeySharesItem } from 'ssv-keys';
import Dropzone from "./Dropzone";
import Spinner from "./Spinner";
import { ethers } from "ethers";
import contractABI from "../utils/ABI.json";
import operatorKeys from '../utils/operators.json';
import operatorIds from '../utils/operatorIds.json';
// import styles from '../styles/index.module.css';

enum STEPS {
  START = 0,
  ENTER_PASSWORD = 1,
  DECRYPT_KEYSTORE = 2,
  ENCRYPT_SHARES = 3,
  FINISH = 4,
}

const UserFlow: React.FC = () => {
  const ssvKeys = new SSVKeys();
  const keyShares = new KeyShares();
  const keySharesItem = new KeySharesItem();

  const [step, setStep] = useState<STEPS>(STEPS.START);
  const [password, setPassword] = useState<string>('');
  const [keySharesData, setKeyShares] = useState<string>('');
  const [finalPayload, setFinalPayload] = useState<string>('');
  const [keystoreFile, setKeystoreFile] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        if (e.target?.result) {
          setKeystoreFile(e.target.result as string);
          setStep(STEPS.ENTER_PASSWORD);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const startProcess = async () => {
    setStep(STEPS.DECRYPT_KEYSTORE);
    try {
      const { publicKey, privateKey } = await ssvKeys.extractKeys(keystoreFile, password);
      setStep(STEPS.ENCRYPT_SHARES);
      console.log('Private key ready');

      const operators = operatorKeys.map((operator, index) => ({
        id: operatorIds[index],
        operatorKey: operator,
      }));

      const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

      const TEST_OWNER_NONCE = 1;
      const TEST_OWNER_ADDRESS = '0x81592c3de184a3e2c0dcb5a261bc107bfa91f494';

      const payload = await keySharesItem.buildPayload(
        { publicKey, operators, encryptedShares },
        { ownerAddress: TEST_OWNER_ADDRESS, ownerNonce: TEST_OWNER_NONCE, privateKey }
      );

      setFinalPayload(JSON.stringify(payload));
      console.log('Payload ready');

      keySharesItem.update({
        ownerAddress: TEST_OWNER_ADDRESS,
        ownerNonce: TEST_OWNER_NONCE,
        operators,
        publicKey
      });

      keyShares.add(keySharesItem);
      setKeyShares(keyShares.toJson());
      console.log('KeyShares ready');
      setStep(STEPS.FINISH);
    } catch (e) {
      alert((e as Error).message);
      setStep(STEPS.ENTER_PASSWORD);
    }
  };

  const downloadKeyShares = () => {
    const blob = new Blob([keySharesData], { type: 'application/json;charset=utf-8;' });
    const filename = 'KeyShares.json';

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleContractInteraction = async () => {
    const contractAddress = "0x5Dbf9a62BbcC8135AF60912A8B0212a73e4a6629";
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL);
    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const parsedPayload = JSON.parse(finalPayload);

    const { publicKey, operatorIds, sharesData } = parsedPayload;
    const amount = 1;
    const cluster = [0, 0, 0, true, 0];

    const transaction = await contract.registerValidator(publicKey, operatorIds, sharesData, amount, cluster);
    const receipt = await transaction.wait();
    console.log(receipt);
  };

  switch (step) {
    case STEPS.START:
      return (
        <div >
          <h3>Select operators</h3>
          <button>Select no of operators</button>

          <h3>Select keystore file</h3>
          <h5>You can select <code>test.keystore.json</code> file in the root of this project. Password: <code>testtest</code></h5>
          <Dropzone onDrop={onDrop} accept={{ 'application/json': ['.json'] }}  />
        </div>
      );
    case STEPS.ENTER_PASSWORD:
      return (
        <div >
          <h3>Enter keystore password</h3>
          <input type="password" onChange={(event) => setPassword(event.target.value)}/>
          <br />
          <button type="button" onClick={startProcess} >
            Decrypt Keystore File
          </button>
        </div>
      );
    case STEPS.DECRYPT_KEYSTORE:
      return (
        <div >
          <h3>Decrypting keystore with your password..</h3>
          <Spinner />
        </div>
      );
    case STEPS.ENCRYPT_SHARES:
      return (
        <div >
          <h3>Encrypting Shares..</h3>
          <Spinner />
        </div>
      );
    case STEPS.FINISH:
      return (
        <div >
          <h3>Results</h3>
          <h4>Dummy operators data:</h4>
          <table >
            <thead>
              <tr>
                <th>ID</th>
                <th>Public Key</th>
              </tr>
            </thead>
            <tbody>
              {operatorKeys.map((operator, index) => (
                <tr key={index}>
                  <td>{operatorIds[index]}</td>
                  <td>{operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Web3 Raw Payload</h4>
          <textarea rows={10}  value={finalPayload} readOnly />
          <h4>KeyShares File Contents</h4>
          <textarea rows={10} value={keySharesData} readOnly />
          <br />
          <br />
          <button type="button" onClick={downloadKeyShares} disabled={!keySharesData} >
            Download Keyshares File
          </button>

          <h5>Transaction needed</h5>
          <button onClick={handleContractInteraction} >
            Call Contract Function
          </button>
          <br />
        </div>
      );
    default:
      return null;
  }
};

export default UserFlow;