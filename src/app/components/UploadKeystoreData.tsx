import React, { useState, useEffect } from "react";
import { CheckCircle, Eye, EyeOff, CloudUpload, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"


enum STEPS {
  START = 0,
  ENTER_PASSWORD = 1,
  DECRYPT_KEYSTORE = 2,
  ENCRYPT_SHARES = 3,
  FINISH = 4,
}

function UploadDepositData() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const [step, setStep] = useState<STEPS>(STEPS.START);
  const [keySharesData, setKeyShares] = useState<string>('');
  const [finalPayload, setFinalPayload] = useState<string>('');
  const [keystoreFile, setKeystoreFile] = useState<string>('');


  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenUploadPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("hasSeenUploadPopup", "true");
    }
  }, []);

  const generateValidatorKey = async () => {

    setStep(STEPS.DECRYPT_KEYSTORE);

    try {
      const response = await fetch('/api/process-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keystoreFile, password }),
      });
      console.log("response: ", response);


      if (!response.ok) {
        throw new Error('Failed to process keystore');
      }

      const data = await response.json();
      setFinalPayload(JSON.stringify(data.payload));
      setKeyShares(JSON.stringify(data.keyShares));
      console.log('KeyShares and Payload received from API');

      const parsedPayload = JSON.parse(finalPayload);
      const publicKey=parsedPayload.publicKey;
      const operatorIds=parsedPayload.operatorIds;
      const shares = parsedPayload.sharesData;

      setStep(STEPS.FINISH);
    } catch (e) {
      alert((e as Error).message);
      setStep(STEPS.ENTER_PASSWORD);
    }


  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setKeystoreFile(result);
        }
      };

      reader.readAsText(file); // Assuming the keystore file is in text or JSON format.
      setFile(file);
    }
  };


  const closePopup = () => {
    setShowPopup(false);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-8 mx-auto">
      {/* Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="absolute inset-0 flex justify-center items-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={closePopup}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Welcome to Upload Keystore Data
              </h3>
              <p className="text-gray-600 mb-4">
                This tool allows you to upload keystore data and password
                to generate the keyshares and distibute among the operators selected.
              </p>
              <button
                onClick={closePopup}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Blur Effect */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${showPopup ? "blur-sm" : ""
          }`}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-500 mb-6">
            Upload Keystore File
          </h2>

          <p className="text-sm text-gray-600">
            SUbmit the keysotre file and corresponding password to generate the keyshares.
          </p>
          <p className="text-sm text-gray-600">
            Rest easy, we use proper encryption practises to ensure security of your password. We do not store the password at any place.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-300 rounded-md overflow-hidden p-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {file ? (
                  <CheckCircle className="h-12 w-12 text-gray-500 mb-4" />
                ) : (
                  <CloudUpload className="h-12 w-12 text-gray-500 mb-4" />
                )}
                <p className="text-gray-500 mb-2">
                  {file ? file.name : "Drag file to upload or browse"}
                </p>
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                placeholder="Enter password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={generateValidatorKey}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded border border-blue-200 text-sm transition-colors duration-300"
          >
            Generate Keyshares
          </button>
        </div>
      </div>

      {/* Button to Reopen Popup */}
      <div className="mt-8 text-center">
        <button
          onClick={openPopup}
          className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg"
        >
          <Info className="w-5 h-5 mr-2" />
          Show Welcome Message
        </button>
      </div>
    </div>
  );
}

export default UploadDepositData;