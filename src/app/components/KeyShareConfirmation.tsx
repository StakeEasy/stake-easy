import React from 'react';

const KeyShareConfirmation: React.FC = () => {
  return (
    <div className="flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Run a Distributed Validator</h2>
        <p className="mb-4">
          Distribute your validation duties among a set of distributed nodes to improve your validator resilience, safety, liveness, and diversity.
        </p>
        <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
        <ul className="list-disc list-inside mb-4">
          <li>An active Ethereum validator (deposited to Beacon Chain)</li>
          <li>SSV tokens to cover operational fees</li>
        </ul>
        <div className="flex justify-end space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Generate new key shares</button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">I already have key shares</button>
        </div>
      </div>
    </div>
  );
};

export default KeyShareConfirmation;