// SkeletonLoader.tsx
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <tr className="bg-gray-200 animate-pulse">
      <td colSpan={7} className="p-4">
        <div className="h-6 bg-gray-300 rounded"></div>
      </td>
    </tr>
  );
};

export default SkeletonLoader;
