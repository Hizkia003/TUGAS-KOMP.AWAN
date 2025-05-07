import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  error?: Error;
  retryAction?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  error,
  retryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <AlertTriangle size={32} className="text-drive-red mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      
      {error && (
        <p className="text-sm text-gray-500 mb-4 max-w-md">
          {error.message || 'An unexpected error occurred.'}
        </p>
      )}
      
      {retryAction && (
        <button
          onClick={retryAction}
          className="flex items-center gap-2 bg-drive-blue text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-drive-blue/90 transition-colors"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;