import React from 'react';
import { HardDrive } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="bg-drive-blue rounded-md p-2 mb-4 animate-pulse">
          <HardDrive size={32} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Google Drive Manager
        </h1>
        <p className="text-gray-500">Loading your files...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;