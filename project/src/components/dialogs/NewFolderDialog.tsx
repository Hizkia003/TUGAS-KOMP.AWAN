import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { driveService } from '../../services/driveService';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parentFolderId?: string;
}

const NewFolderDialog: React.FC<NewFolderDialogProps> = ({
  isOpen,
  onClose,
  parentFolderId,
}) => {
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  
  if (!isOpen) return null;
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  };
  
  // Create folder
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }
    
    try {
      setIsCreating(true);
      await driveService.createFolder(folderName, parentFolderId);
      toast.success(`Folder "${folderName}" created successfully`);
      
      // Refresh file list
      queryClient.invalidateQueries(['files', parentFolderId]);
      
      // Reset state and close dialog
      setFolderName('');
      onClose();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    } finally {
      setIsCreating(false);
    }
  };
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateFolder();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Create New Folder</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            disabled={isCreating}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <FolderPlus size={20} className="text-drive-yellow mr-2" />
            <span className="text-sm text-gray-600">
              New folder in {parentFolderId ? 'current folder' : 'My Drive'}
            </span>
          </div>
          
          <input
            type="text"
            value={folderName}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Folder name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-drive-blue/50 focus:border-drive-blue/50"
            autoFocus
            disabled={isCreating}
          />
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isCreating}
          >
            Cancel
          </button>
          
          <button
            onClick={handleCreateFolder}
            disabled={isCreating || !folderName.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-drive-blue rounded-md hover:bg-drive-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewFolderDialog;