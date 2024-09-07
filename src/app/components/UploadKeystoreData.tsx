import React, { useState } from "react";
import { CheckCircle, Eye, EyeOff, CloudUpload, ArrowLeft } from "lucide-react";
import SelectTime from "./SelectTime";

enum STEPS {
  START = 0,
  ENTER_PASSWORD = 1,
  DECRYPT_KEYSTORE = 2,
  ENCRYPT_SHARES = 3,
  FINISH = 4,
}

interface UploadKeystoreDataProps {
  goBack: () => void; 
  parsedPayload: any;
}

function UploadKeystoreData({ goBack, parsedPayload }: UploadKeystoreDataProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showSelectTime, setShowSelectTime] = useState(false);

  const [step, setStep] = useState<STEPS>(STEPS.START);
  const [keySharesData, setKeyShares] = useState<string>('');
  const [keystoreFile, setKeystoreFile] = useState<string>('');
  const [newParsedPayload, setNewParsedPayload] = useState<any>({});
  const [finalPayload, setFinalPayload] = useState<string>('');

  const handleSelectTime  = async () => {
    setStep(STEPS.DECRYPT_KEYSTORE);

    try {
      const response = await fetch('/api/process-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keystoreFile, password, operatorsData }),
      });
      console.log("response: ", response);

      if (!response.ok) {
        throw new Error('Failed to process keystore');
      }

      const responseText = await response.text();
  
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error('Invalid JSON response from server');
      }
  
      console.log("Parsed data:", data);
  
      setFinalPayload(JSON.stringify(data.payload));
      setKeyShares(JSON.stringify(data.keyShares));
      console.log('KeyShares and Payload received from API');
  
      const parsedPayload = data.payload;
      setParsedPayload(parsedPayload);
      // const publicKey = parsedPayload.publicKey;
      // const operatorIds = parsedPayload.operatorIds;
      // const shares = parsedPayload.sharesData;
  
      setStep(STEPS.FINISH);
    } catch (e) {
      console.error("Error in handleSelectTime:", e);
      alert((e as Error).message);
      setStep(STEPS.ENTER_PASSWORD);
    }
  
    setShowSelectTime(true);
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

      reader.readAsText(file);
      setFile(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const goBackToSelectTime = () => {
    setShowSelectTime(false);
  };

  if (showSelectTime) {
    return <SelectTime goBack={goBackToSelectTime} parsedPayload={parsedPayload} />;
  }

  return (
    <div className="">
      <button onClick={goBack} className="flex items-center mb-4 text-white ">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      {/* Main Content with Blur Effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ">
        <div className="flex flex-col justify-center">
          <h2
            className="text-2xl font-bold mb-3"
            style={{
              background: "linear-gradient(to right, #DA619C, #FF844A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Upload Keystore File
          </h2>

          <p className="text-md text-white">
            Submit the keysotre file and corresponding password to generate the keyshares.
          </p>
          <p className="text-md text-white">
            Rest easy, we use proper encryption practises to ensure security of your password. We do not store the password at any place.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-col items-center justify-center bg-[#161515] rounded-md overflow-hidden p-6 transition-all duration-300 focus-within:ring-1 focus-within:ring-blue-500">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {file ? (
                  <CheckCircle className="h-16 w-16 p-4 bg-gradient-to-b from-[#FC8151] to-[#C951C0] text-white rounded-full" />
                ) : (
                  <CloudUpload className="h-16 w-16 mb-4 p-4 bg-gradient-to-b from-[#FC8151] to-[#C951C0] text-white rounded-full" />
                )}
                <p className="text-white">
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
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="flex gap-4">
              <div className="grow relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <button
                onClick={handleSelectTime}
                style={{
                  border: "1px solid transparent",
                  borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
                  borderImageSlice: 1,
                  background: "linear-gradient(to right, #DA619C, #FF844A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                className=" grow text-white py-[6px] px-4 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-orange-600 focus:ring-opacity-50 font-bold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadKeystoreData;