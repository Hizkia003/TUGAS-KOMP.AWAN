import React from 'react';
import { FolderOpen, Upload } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <FolderOpen size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-md">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-drive-blue text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-drive-blue/90 transition-colors"
        >
          {actionText.toLowerCase().includes('upload') ? (
            <Upload size={16} />
          ) : null}
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;