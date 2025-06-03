import React from 'react';

export default function MagnetometerPage() {
  return (
    <main className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Magnetometer Dashboard</h1>
        
        <div className="flex justify-center mb-6">
          <svg 
            className="animate-spin h-16 w-16 text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        
        <p className="text-lg mb-2 text-gray-700">Currently In Development</p>
        <p className="text-gray-500">
          The magnetometer dashboard is being built and will be available soon. 
          Check back later for detailed magnetic field data visualizations.
        </p>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            Expected completion: Q3 2025
          </p>
        </div>
      </div>
    </main>
  );
}