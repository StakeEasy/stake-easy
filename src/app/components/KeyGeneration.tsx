import React, { useState, useEffect } from "react";
import { X, Info, ArrowLeft, MessageCircleQuestionIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function KeyGeneration() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [showTerminalSteps, setShowTerminalSteps] = useState(false);
  const [showGUISteps, setShowGUISteps] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the main popup
    const hasSeenPopup = localStorage.getItem("hasSeenKeyGenPopup");
    if (!hasSeenPopup) {
      setPopupType("main");
      setShowPopup(true);
      localStorage.setItem("hasSeenKeyGenPopup", "true");
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    setPopupType("");
  };

  const openPopup = (type: any) => {
    setPopupType(type);
    setShowPopup(true);
  };

  const acceptTerms = () => {
    setShowPopup(false);
    if (popupType === "terminal") {
      setShowTerminalSteps(true);
    } else if (popupType === "gui") {
      setShowGUISteps(true);
    }
    setPopupType("");
  };

  const goBack = () => {
    setShowTerminalSteps(false);
    setShowGUISteps(false);
  };

  // Steps for Method 1 (Terminal)
  const terminalSteps = [
    "Open Terminal",
    "Navigate to Directory",
    "Enter Key Generation Command",
    "Input Required Information",
    "Verify Key Generation Output",
    "Store the Key Securely",
  ];

  // Steps for Method 2 (Wagyu GUI App)
  const guiSteps = [
    "Download and Install Wagyu",
    "Open the Wagyu App",
    "Select 'Generate Key'",
    "Follow the On-Screen Instructions",
    "Save the Generated Key",
    "Verify the Key in the App",
  ];

  return (
    <div
      className="relative   mx-auto transition-all duration-300 w-[80%]"
      style={{
        background: "linear-gradient(to right, #1D1D1D 0%, #191919 100%)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "80px 40px",
        borderRadius: "20px",
      }}
    >
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
              style={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                borderImageSlice: 1,
                color: "white",
                background: "linear-gradient(to right, #121212, #252525)",
                boxShadow: "18px 26px 70px 0px rgba(255, 231, 105, 0.09);",
                padding: "4rem 3rem",
              }}
              className=" p-6 rounded-lg shadow-xl w-full max-w-lg relative max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={closePopup}
                style={{
                  borderRadius: "15px",
                  border: "1px solid white",
                  padding: "2px",
                }}
                className="absolute top-2 right-2 text-white "
              >
                <X className="w-5 h-5" />
              </button>

              {popupType === "terminal" && (
                <>
                  <h3
                    className="text-xl font-semibold text-white mb-4"
                    style={{ letterSpacing: "1px" }}
                  >
                    Before you begin the key generation process, there are a few
                    important points to keep in mind
                  </h3>
                  <p
                    className="text-white mb-4 text-sm"
                    style={{ textAlign: "justify" }}
                  >
                    Prepare pen and paper to write down important information.
                    This includes the 24-word secret recovery phrase (also
                    called the “mnemonic”, or the “seed phrase”) and the
                    keystore password. Safely storing and keeping these details
                    secure is your responsibility.
                  </p>
                  <p
                    className="text-white mb-4 text-sm"
                    style={{ textAlign: "justify" }}
                  >
                    It is vital to have multiple secure backups of your secret
                    recovery phrase and password. The secret recovery phrase is
                    the only way to withdraw your stake, so treat it with
                    extreme care. Losing this information will result in
                    permanent loss of access to your funds.
                  </p>
                  <p
                    className="text-white mb-4 text-sm"
                    style={{ textAlign: "justify" }}
                  >
                    If possible, use an air-gapped computer during the key
                    generation process. An air-gapped computer is one that is
                    not and has not been connected to any network, minimizing
                    the risk of exposing your secret recovery phrase. If an
                    air-gapped computer is not available, ensure you disconnect
                    from the internet by turning off all networking options
                    (unplugging Ethernet, switching off Wi-Fi, etc.) while
                    generating your keys.
                  </p>
                  <button
                    onClick={acceptTerms}
                    style={{
                      background: "linear-gradient(to right, #A257EC, #D360A6)",
                      borderRadius: "20px",
                      color: "white",
                    }}
                    className=" text-white py-2 px-4 rounded-md shadow-lg"
                  >
                    Accept Terms
                  </button>
                </>
              )}
              {popupType === "gui" && (
                <>
                  <h3
                    className="text-xl font-semibold text-white mb-4"
                    style={{ letterSpacing: "1px" }}
                  >
                    Before you begin the key generation process, there are a few
                    important points to keep in mind
                  </h3>
                  <p
                    className="text-white mb-4 text-sm"
                    style={{ textAlign: "justify" }}
                  >
                    Prepare pen and paper to write down important information.
                    This includes the 24-word secret recovery phrase (also
                    called the “mnemonic”, or the “seed phrase”) and the
                    keystore password. Safely storing and keeping these details
                    secure is your responsibility.
                  </p>
                  <p
                    className="text-white mb-4 text-sm"
                    style={{ textAlign: "justify" }}
                  >
                    It is vital to have multiple secure backups of your secret
                    recovery phrase and password. The secret recovery phrase is
                    the only way to withdraw your stake, so treat it with
                    extreme care. Losing this information will result in
                    permanent loss of access to your funds.
                  </p>
                  <p
                    className="text-white mb-4 text-sm"
                    style={{ textAlign: "justify" }}
                  >
                    If possible, use an air-gapped computer during the key
                    generation process. An air-gapped computer is one that is
                    not and has not been connected to any network, minimizing
                    the risk of exposing your secret recovery phrase. If an
                    air-gapped computer is not available, ensure you disconnect
                    from the internet by turning off all networking options
                    (unplugging Ethernet, switching off Wi-Fi, etc.) while
                    generating your keys.
                  </p>
                  <button
                    onClick={acceptTerms}
                    style={{
                      background: "linear-gradient(to right, #A257EC, #D360A6)",
                      borderRadius: "20px",
                      color: "white",
                    }}
                    className=" text-white py-2 px-4 rounded-md shadow-lg"
                  >
                    Accept Terms
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Content with Blur Effect */}
      <div
        className={`transition-all duration-300 ${showPopup ? "blur-sm" : ""}`}
      >
        {/* {(showTerminalSteps || showGUISteps) && (
          <button
            onClick={goBack}
            className="flex items-center mb-4 text-white "
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        )} */}
        {showTerminalSteps && (
          <div className="space-y-4">
            <h3
              className="text-xl font-semibold text-white mb-4 text-start"
              // style={{
              //   background: "linear-gradient(to right, #DA619C, #FF844A)",
              //   WebkitBackgroundClip: "text",
              //   WebkitTextFillColor: "transparent",
              // }}
            >
              Terminal Key Generation Steps
            </h3>
            
          </div>
        )}
        {showGUISteps && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-500 mb-4 text-center">
              GUI Key Generation Steps
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              {guiSteps.map((step, index) => (
                <li key={index} className="text-gray-800">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
        {!showTerminalSteps && !showGUISteps && (
          <div className="space-y-4">
            <h1
              className="text-xl font-semibold text-white mb-4 text-center"
              style={{ letterSpacing: "1px", fontWeight: "bold " }}
            >
              Generate Keys
            </h1>
            <div className="text-white pl-[40px] p-[40px] pt-3 pb-3 text-center">
              Staking keys play a crucial role in Ethereum staking as validators
              use them to sign attestations and proposals. These keys are also
              necessary for depositing the 32 ETH stake. Additionally, the
              staking keys will be used to set the Withdrawal Address for
              receiving rewards and making final withdrawals.
            </div>
            <div className="text-white pl-[40px] p-[40px] pt-0 pb-3 text-center">
              As a user looking to participate in staking, you will need to
              generate your own staking keys.
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => openPopup("terminal")}
                style={{
                  border: "1px solid transparent",
                  borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
                  borderImageSlice: 1,
                  background: "linear-gradient(to right, #DA619C, #FF844A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                className="inline-flex items-center  py-2 px-4 rounded-md shadow-lg mr-4"
              >
                Terminal commands
              </button>
              <button
                onClick={() => openPopup("gui")}
                style={{
                  border: "1px solid transparent",
                  borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
                  borderImageSlice: 1,
                  background: "linear-gradient(to right, #DA619C, #FF844A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                className="inline-flex items-center  py-2 px-4 rounded-md shadow-lg"
              >
                GUI commands
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KeyGeneration;