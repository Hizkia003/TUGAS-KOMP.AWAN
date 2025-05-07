import React from 'react';
import { UserCircle as LoaderCircle } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoaderCircle size={32} className="text-drive-blue animate-spin mb-4" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingIndicator;