import React, { useState } from 'react';
import { X, Edit3 } from 'lucide-react';
import { driveService } from '../../services/driveService';
import toast from 'react-hot-toast';

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  currentName: string;
  onSuccess?: () => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
  isOpen,
  onClose,
  fileId,
  currentName,
  onSuccess,
}) => {
  const [newName, setNewName] = useState(currentName);
  const [isRenaming, setIsRenaming] = useState(false);
  
  if (!isOpen) return null;
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };
  
  // Rename file/folder
  const handleRename = async () => {
    if (!newName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    if (newName === currentName) {
      onClose();
      return;
    }
    
    try {
      setIsRenaming(true);
      await driveService.renameFile(fileId, newName);
      toast.success(`Renamed successfully`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error renaming file:', error);
      toast.error('Failed to rename');
    } finally {
      setIsRenaming(false);
    }
  };
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Rename</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            disabled={isRenaming}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Edit3 size={20} className="text-drive-blue mr-2" />
            <span className="text-sm text-gray-600">
              Enter a new name for "{currentName}"
            </span>
          </div>
          
          <input
            type="text"
            value={newName}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="New name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-drive-blue/50 focus:border-drive-blue/50"
            autoFocus
            disabled={isRenaming}
          />
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isRenaming}
          >
            Cancel
          </button>
          
          <button
            onClick={handleRename}
            disabled={isRenaming || !newName.trim() || newName === currentName}
            className="px-4 py-2 text-sm font-medium text-white bg-drive-blue rounded-md hover:bg-drive-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isRenaming ? 'Renaming...' : 'Rename'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameDialog;