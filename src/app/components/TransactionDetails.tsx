import React from 'react'

const page = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="max-w-2xl mx-auto bg-gray-900 text-white rounded-lg shadow-md">
            <div className="bg-gray-800 text-white p-4 rounded-t-lg">
              <h1 className="text-xl font-bold">Transaction Details</h1>
              <p className="text-sm">Validator Public Key</p>
              <p className="text-xs">
                0xa61ffd0c41b28e12b3ce64b85193cd31630505699bf5637b94c998
              </p>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">Selected Operators</h2>
              {/* <Operator name="ChainUp @" id="25" ssv={0.0} days={182} />
              <Operator name="Lido - Maria @" id="29" ssv={0.0} days={182} />
              <Operator name="Lido - Stakely @" id="30" ssv={0.0} days={182} />
              <Operator name="Lido - Openbitiab @" id="37" ssv={0.0} days={182} /> */}
            </div>
            <div className="bg-gray-800 text-white p-4 rounded-b-lg">
              <h2 className="text-lg font-bold">Funding Summary</h2>
              <div className="flex justify-between">
                <span>Operator fee</span>
                <span>0.0 SSV</span>
              </div>
              <div className="flex justify-between">
                <span>Network fee</span>
                <span>0.5 SSV</span>
              </div>
              <div className="flex justify-between">
                <span>Liquidation collateral</span>
                <span>1.0 SSV</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>1.5 SSV</span>
              </div>
            </div>
            <div className="flex justify-between p-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded">
                Approve SSV
              </button>
              <button className="bg-green-500 text-white py-2 px-4 rounded">
                Register Validator
              </button>
            </div>
          </div>
        </div>
      );
}

export default page