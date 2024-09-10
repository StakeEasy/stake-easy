import React from 'react';

interface OperatorProps {
  name: string;
  id: string;
  ssv: number;
  days: number;
}

const Operator: React.FC<OperatorProps> = ({ name, id, ssv, days }) => {
  return (
    <div className="flex justify-between items-center p-2 border-b border-gray-700">
      <div>
        <p className="text-md font-medium" 
        style={{
          background: "rgba(252, 129, 81, 1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        >{name}</p>
        <p className="text-xs">ID: {id}</p>
      </div>
      <div className="text-right">
        <p className="text-sm">{ssv} SSV</p>
        <p className="text-xs">/{days} days</p>
      </div>
    </div>
  );
};

export default Operator;