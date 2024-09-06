import React, { useState, useEffect, useRef } from "react";
import { X, Copy, CheckCircle, ArrowLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function KeyGeneration() {
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupBlur, setShowPopupBlur] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [showTerminalSteps, setShowTerminalSteps] = useState(false);
  const [showGUISteps, setShowGUISteps] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Check if the user has already seen the main popup
    const hasSeenPopup = localStorage.getItem("hasSeenKeyGenPopup");
    if (!hasSeenPopup) {
      setPopupType("main");

      setShowPopupBlur(true);
      localStorage.setItem("hasSeenKeyGenPopup", "true");
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    setPopupType("");
    setShowPopupBlur(false);
  };

  const openPopup = (type: any) => {
    setPopupType(type);
    setShowPopup(true);
    setShowPopupBlur(false);
  };

  const acceptTerms = () => {
    setShowPopup(false);
    setShowPopupBlur(false);
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

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: any) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closePopup();
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <div
      className="relative   mx-auto transition-all duration-300 w-[70%]"
      style={{
        background: "linear-gradient(to right, #1D1D1D 0%, #191919 100%)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "40px 40px",
        borderRadius: "20px",
      }}
    >
      <AnimatePresence>
        {showPopupBlur && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                borderImageSlice: 1,
                color: "white",
                textAlign: "center",
                background: "linear-gradient(to right, #121212, #252525)",
                boxShadow: "18px 26px 70px 0px rgba(255, 231, 105, 0.09);",
                padding: "4rem 3rem",
              }}
              className=" rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <div className="flex justify-between items-center mb-4 ">
                <div
                  className="inline-block 3 py-1 text-lg mb-3"
                  style={{
                    borderRadius: "8px",
                    textAlign: "justify",
                  }}
                >
                  Generate Keys
                </div>

                <button
                  onClick={closePopup}
                  style={{
                    padding: "5px",
                  }}
                  className="absolute top-2 right-2 text-[#FC8150] "
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div style={{ textAlign: "justify", paddingBottom: "10px" }}>
                Here, you will generate your validator key using the Eigenpod
                address you created earlier. You will need to set a keystore
                password, which will be used to decrypt your key file later
              </div>
              <div style={{ textAlign: "justify", paddingBottom: "10px" }}>
                Two files named Keystore and Deposit will be created along with
                a seed phrase. Keep these along with keystore password in a
                secure and offline location.
              </div>

              <button
                onClick={closePopup}
                style={{
                  background: "linear-gradient(to right, #A257EC, #D360A6)",
                  textAlign: "center",
                  color: "white",
                  marginTop: "10px",
                }}
                className=" text-white py-2 px-4 rounded-md shadow-lg text-center"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
            ref={popupRef}
              style={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                borderImageSlice: 1,
                textAlign: "center",
                color: "white",
                background: "linear-gradient(to right, #121212, #252525)",
                boxShadow: "18px 26px 70px 0px rgba(255, 231, 105, 0.09);",
                padding: "4rem 3rem",
              }}
              className=" p-6 rounded-lg shadow-xl w-full relative "
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={closePopup}
                style={{
                  padding: "5px",
                }}
                className="absolute top-2 right-2 text-[#FC8150] "
              >
                <X className="w-5 h-5" />
              </button>

              {popupType === "terminal" && (
                <>
                  <div>
                    <h3
                      className="font-semibold text-white mb-4"
                      style={{
                        letterSpacing: "1px",
                        lineHeight: "auto",
                        fontSize: "1.7rem",
                        textAlign: "justify",
                        padding: "0px 30px",
                      }}
                    >
                      Before you begin the key generation process, there are a
                      few important points to keep in mind
                    </h3>
                    <div style={{ padding: "0px 30px" }}>
                      <p
                        className="text-white mb-4 text-sm"
                        style={{ textAlign: "justify", fontSize: "1rem" }}
                      >
                        Prepare pen and paper to write down important
                        information. This includes the 24-word secret recovery
                        phrase (also called the “mnemonic”, or the “seed
                        phrase”) and the keystore password. Safely storing and
                        keeping these details secure is your responsibility.
                      </p>
                      <p
                        className="text-white mb-4 text-sm"
                        style={{ textAlign: "justify", fontSize: "1rem" }}
                      >
                        It is vital to have multiple secure backups of your
                        secret recovery phrase and password. The secret recovery
                        phrase is the only way to withdraw your stake, so treat
                        it with extreme care. Losing this information will
                        result in permanent loss of access to your funds.
                      </p>
                      <p
                        className="text-white mb-4 text-sm"
                        style={{ textAlign: "justify", fontSize: "1rem" }}
                      >
                        If possible, use an air-gapped computer during the key
                        generation process. An air-gapped computer is one that
                        is not and has not been connected to any network,
                        minimizing the risk of exposing your secret recovery
                        phrase. If an air-gapped computer is not available,
                        ensure you disconnect from the internet by turning off
                        all networking options (unplugging Ethernet, switching
                        off Wi-Fi, etc.) while generating your keys.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={acceptTerms}
                    style={{
                      background: "linear-gradient(to right, #A257EC, #D360A6)",
                      textAlign: "center",
                      color: "white",
                      marginTop: "30px",
                    }}
                    className=" text-white py-2 px-4 rounded-md shadow-lg text-center"
                  >
                    Accept Terms
                  </button>
                </>
              )}
              {popupType === "gui" && (
                <>
                  <h3
                    className="font-semibold text-white mb-4"
                    style={{
                      letterSpacing: "1px",
                      lineHeight: "auto",
                      fontSize: "1.7rem",
                      textAlign: "justify",
                      padding: "0px 30px",
                    }}
                  >
                    Before you begin the key generation process, there are a few
                    important points to keep in mind
                  </h3>
                  <div style={{ padding: "0px 30px" }}>
                    <p
                      className="text-white mb-4 text-sm"
                      style={{ textAlign: "justify", fontSize: "1rem" }}
                    >
                      Prepare pen and paper to write down important information.
                      This includes the 24-word secret recovery phrase (also
                      called the “mnemonic”, or the “seed phrase”) and the
                      keystore password. Safely storing and keeping these
                      details secure is your responsibility.
                    </p>
                    <p
                      className="text-white mb-4 text-sm"
                      style={{ textAlign: "justify", fontSize: "1rem" }}
                    >
                      It is vital to have multiple secure backups of your secret
                      recovery phrase and password. The secret recovery phrase
                      is the only way to withdraw your stake, so treat it with
                      extreme care. Losing this information will result in
                      permanent loss of access to your funds.
                    </p>
                    <p
                      className="text-white mb-4 text-sm"
                      style={{ textAlign: "justify", fontSize: "1rem" }}
                    >
                      If possible, use an air-gapped computer during the key
                      generation process. An air-gapped computer is one that is
                      not and has not been connected to any network, minimizing
                      the risk of exposing your secret recovery phrase. If an
                      air-gapped computer is not available, ensure you
                      disconnect from the internet by turning off all networking
                      options (unplugging Ethernet, switching off Wi-Fi, etc.)
                      while generating your keys.
                    </p>
                  </div>
                  <button
                    onClick={acceptTerms}
                    style={{
                      background: "linear-gradient(to right, #A257EC, #D360A6)",

                      color: "white",
                      marginTop: "30px",
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
        {(showTerminalSteps || showGUISteps) && (
          <button
            onClick={goBack}
            className="flex items-center mb-4 text-white "
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        )}
        {showTerminalSteps && (
          <div className="0 text-white rounded-lg">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ letterSpacing: "1px", fontSize: "2rem" }}
            >
              Terminal Method
            </h2>

            <div className="flex space-x-6">
              <div
                className="flex-1"
                style={{
                  boxShadow: "rgb(69 69 69) 0px 1px 6px 2px",
                  padding: "10px",
                }}
              >
                <div
                  className="inline-block 3 py-1  text-sm mb-3"
                  style={{
                    border: "1px solid transparent",
                    borderImage:
                      "linear-gradient(to right, #DA619C , #FF844A )",
                    borderImageSlice: 1,
                    padding: "5px 15px",
                    borderRadius: "8px",
                  }}
                >
                  Step 1
                </div>
                <h3
                  className="text-xl font-semibold mb-3 "
                  style={{
                    background: "linear-gradient(to right, #DA619C, #FF844A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Installation
                </h3>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Go to Releases Pages of GitHub repo:
                  </p>
                </div>

                <div className="bg-black p-3 rounded-md flex justify-between items-center mb-[5px]">
                  <a
                    href="https://github.com/ethereum/staking-deposit-cli/releases"
                    target="blank"
                    style={{ color: "#A257EC" }}
                  >
                    https://github.com/ethereum/staking-deposit-cli/releases
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Download the zip file according to your OS and architecture.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Unzip it and open terminal in the folder “eth2deposit-cli-*”{" "}
                  </p>
                </div>
              </div>

              <div
                className="flex-1"
                style={{
                  boxShadow: "rgb(69 69 69) 0px 1px 6px 2px",
                  padding: "10px",
                }}
              >
                <div
                  className="inline-block 3 py-1  text-sm mb-3"
                  style={{
                    border: "1px solid transparent",
                    borderImage:
                      "linear-gradient(to right, #DA619C , #FF844A )",
                    borderImageSlice: 1,
                    padding: "5px 15px",
                    borderRadius: "8px",
                  }}
                >
                  Step 2
                </div>
                <h3
                  className="text-xl font-semibold mb-3 "
                  style={{
                    background: "linear-gradient(to right, #DA619C, #FF844A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Run the below command:
                </h3>

                <div className="bg-black p-3 rounded-md flex justify-between items-center mb-[5px]">
                  <code className="text-white text-sm">
                    ./deposit new-mnemonic --language english --num_validators 1
                    <br />
                    --chain mainnet --eth1_withdrawal_address &lt;ETH1
                    ADDRESS&gt;
                  </code>
                  <button
                    className="text-gray-400 hover:text-white"
                    onClick={() =>
                      handleCopy(
                        "./deposit new-mnemonic --language english --num_validators 1 --chain mainnet --eth1_withdrawal_address <ETH1 ADDRESS>"
                      )
                    }
                  >
                    {copied ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    More options for above flags can be viewed here:
                  </p>
                </div>

                <div className="bg-black p-3 rounded-md flex justify-between items-center">
                  <a
                    href="https://github.com/ethereum/staking-deposit-cli#language-argument"
                    target="blank"
                    style={{ color: "#A257EC" }}
                  >
                    https://github.com/ethereum/staking-deposit-cli#language-argument
                  </a>
                </div>
              </div>
            </div>
            <div
              className="flex-1 mt-[30px]"
              style={{
                boxShadow: "rgb(69 69 69) 0px 1px 6px 2px",
                padding: "10px",
              }}
            >
              <h3
                className="text-xl font-semibold mb-3 "
                style={{
                  background: "linear-gradient(to right, #DA619C, #FF844A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Create keys and deposit_data-”.json file.Installation
              </h3>

              <div className="flex items-start space-x-2">
                <ChevronRight
                  className="mt-1 flex-shrink-0 text-[#FFA800]"
                  size={16}
                  style={{
                    border: "1px solid #FFA800",
                    borderRadius: "10px",
                  }}
                />
                <p className="mb-2 text-gray-300">
                  The console will ask to re enter password and eigen pod
                  address. Create a strong password as this will be used to
                  encrypt the key store file.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <ChevronRight
                  className="mt-1 flex-shrink-0 text-[#FFA800]"
                  size={16}
                  style={{
                    border: "1px solid #FFA800",
                    borderRadius: "10px",
                  }}
                />
                <p className="mb-2 text-gray-300">
                  After this, the console gives us a 24-word seed phrase
                  (mnemonic). Copy and store it in a safe place.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <ChevronRight
                  className="mt-1 flex-shrink-0 text-[#FFA800]"
                  size={16}
                  style={{
                    border: "1px solid #FFA800",
                    borderRadius: "10px",
                  }}
                />
                <p className="mb-2 text-gray-300">
                  After executing the above commands, two files will be
                  generated in the “validator_keys” folder. Move them to a
                  secure folder.
                </p>
              </div>
            </div>
          </div>
        )}
        {showGUISteps && (
          <div className="0 text-white rounded-lg">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ letterSpacing: "1px", fontSize: "2rem" }}
            >
              GUI App - Wagyu
            </h2>

            <div className="flex space-x-6">
              <div
                className="flex-1"
                style={{
                  boxShadow: "rgb(69 69 69) 0px 1px 6px 2px",
                  padding: "10px",
                }}
              >
                <div
                  className="inline-block 3 py-1  text-sm mb-3"
                  style={{
                    border: "1px solid transparent",
                    borderImage:
                      "linear-gradient(to right, #DA619C , #FF844A )",
                    borderImageSlice: 1,
                    padding: "5px 15px",
                    borderRadius: "8px",
                  }}
                >
                  Step 1
                </div>
                <h3
                  className="text-xl font-semibold mb-3 "
                  style={{
                    background: "linear-gradient(to right, #DA619C, #FF844A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Installation
                </h3>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">Visit below site:</p>
                </div>

                <div className="bg-black p-3 rounded-md flex justify-between items-center mb-[5px]">
                  <a
                    href="https://wagyu.gg/"
                    target="blank"
                    style={{ color: "#A257EC" }}
                  >
                    https://wagyu.gg/
                  </a>
                  <button
                    className="text-gray-400 hover:text-white"
                    onClick={() =>
                      handleCopy(
                        "./deposit new-mnemonic --language english --num_validators 1 --chain mainnet --eth1_withdrawal_address <ETH1 ADDRESS>"
                      )
                    }
                  >
                    {copied ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    download the Wagyu Key Generator for your computer’s
                    operating system.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    When you first attempt to run the software, your computer
                    may warn you that this is an unrecognised app. Given that
                    you have downloaded the software from its official site, you
                    can proceed to override the default security setting.
                  </p>
                </div>
              </div>

              <div
                className="flex-1"
                style={{
                  boxShadow: "rgb(69 69 69) 0px 1px 6px 2px",
                  padding: "10px",
                }}
              >
                <div
                  className="inline-block 3 py-1  text-sm mb-3"
                  style={{
                    border: "1px solid transparent",
                    borderImage:
                      "linear-gradient(to right, #DA619C , #FF844A )",
                    borderImageSlice: 1,
                    padding: "5px 15px",
                    borderRadius: "8px",
                  }}
                >
                  Step 2
                </div>
                <h3
                  className="text-xl font-semibold mb-3 "
                  style={{
                    background: "linear-gradient(to right, #DA619C, #FF844A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Create your Seed Phrase:
                </h3>

                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Click on “Create New Secret Recovery Phrase” to start.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Select network, here Holesky.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Read the instructions and click “Create”.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Write down your seed phrase and make multiple copies.
                    Refrain from using the clipboard. Click “Next”.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Enter the seed phrase here to verify you have the correct
                    one.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-6 mt-[50px]">
              <div
                className="flex-1"
                style={{
                  boxShadow: "rgb(69 69 69) 0px 1px 6px 2px",
                  padding: "10px",
                }}
              >
                <div
                  className="inline-block 3 py-1  text-sm mb-3"
                  style={{
                    border: "1px solid transparent",
                    borderImage:
                      "linear-gradient(to right, #DA619C , #FF844A )",
                    borderImageSlice: 1,
                    padding: "5px 15px",
                    borderRadius: "8px",
                  }}
                >
                  Step 3
                </div>
                <h3
                  className="text-xl font-semibold mb-3 "
                  style={{
                    background: "linear-gradient(to right, #DA619C, #FF844A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Enter Data for key generation:
                </h3>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    In the next screen, Create Keys, there are three important
                    pieces of information that need consideration.
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Number of Validator Keys: Each validator will require a
                    unique key pair.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Keystore Password: Create a strong password as this will be
                    used to encrypt the key store file.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Withdrawal Address: This is where you receive consensus
                    rewards. Setting it to your Eigenpod Address ensures the
                    restaking.
                  </p>
                </div>
              </div>

              <div
                className="flex-1"
                style={{
                  boxShadow: "rgb(69 69 69) 0px 1px 6px 2px",
                  padding: "10px",
                }}
              >
                <div
                  className="inline-block 3 py-1  text-sm mb-3"
                  style={{
                    border: "1px solid transparent",
                    borderImage:
                      "linear-gradient(to right, #DA619C , #FF844A )",
                    borderImageSlice: 1,
                    padding: "5px 15px",
                    borderRadius: "8px",
                  }}
                >
                  Step 4
                </div>
                <h3
                  className="text-xl font-semibold mb-3 "
                  style={{
                    background: "linear-gradient(to right, #DA619C, #FF844A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Create keystore and deposit file.
                </h3>

                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    Select the folder where you want to store the files.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    keystore-xxxxxxx.json and deposit_data-xxxxxx.json files
                    will be generated.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    The keystore file contains the public and private keys for
                    validators to use in signing messages for consensus
                    activities.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <ChevronRight
                    className="mt-1 flex-shrink-0 text-[#FFA800]"
                    size={16}
                    style={{
                      border: "1px solid #FFA800",
                      borderRadius: "10px",
                    }}
                  />
                  <p className="mb-2 text-gray-300">
                    The deposit file has data for making a deposit (staking ETH)
                    for the validator node on ethereum launchpad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {!showTerminalSteps && !showGUISteps && (
          <div className="space-y-4">
            <h1
              className="text-3xl font-semibold text-white mb-4 text-center"
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
                className="inline-flex items-center font-bold py-2 px-4 rounded-md shadow-lg mr-4"
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
                className="inline-flex items-center font-bold py-2 px-4 rounded-md shadow-lg"
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