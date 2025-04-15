import React from 'react';

const HmrTestComponent: React.FC = () => {
  return (
    <div className="p-4 my-4 border border-dashed border-blue-500 bg-blue-50">
      <p className="text-blue-700 font-bold">UPDATED HMR Test Component Content!</p>
    </div>
  );
};

export default HmrTestComponent;
