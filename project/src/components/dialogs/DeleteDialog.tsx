import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { driveService } from '../../services/driveService';
import toast from 'react-hot-toast';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
  onSuccess?: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  fileId,
  fileName,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!isOpen) return null;
  
  // Delete file
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await driveService.trashFile(fileId);
      toast.success(`"${fileName}" moved to trash`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Delete File</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-red-50 rounded-full p-2 mr-4">
              <AlertTriangle size={24} className="text-drive-red" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                Move "{fileName}" to trash?
              </h3>
              <p className="text-sm text-gray-500">
                This item will be moved to trash and can be restored from there if needed.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-drive-red rounded-md hover:bg-drive-red/90 flex items-center gap-2"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Move to Trash'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;