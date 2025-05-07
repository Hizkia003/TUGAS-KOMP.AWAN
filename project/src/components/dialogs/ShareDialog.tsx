import React, { useState } from 'react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { driveService } from '../../services/driveService';
import toast from 'react-hot-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
  onSuccess?: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  fileId,
  fileName,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'reader' | 'writer' | 'commenter'>('reader');
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;
  
  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  // Handle role selection
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as 'reader' | 'writer' | 'commenter');
  };
  
  // Share file
  const handleShare = async () => {
    if (!email.trim()) {
      toast.error('Email address is required');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSharing(true);
      await driveService.shareFile(fileId, email, role);
      toast.success(`Shared successfully with ${email}`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      setEmail('');
    } catch (error) {
      console.error('Error sharing file:', error);
      toast.error('Failed to share file');
    } finally {
      setIsSharing(false);
    }
  };
  
  // Copy share link to clipboard
  const copyShareLink = () => {
    // This would be a real share link in a production app
    // For now, we'll just simulate it
    navigator.clipboard.writeText(`https://drive.google.com/file/d/${fileId}/view`);
    setCopied(true);
    toast.success('Link copied to clipboard');
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Share "{fileName}"</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Share2 size={20} className="text-drive-blue mr-2" />
            <span className="text-sm text-gray-600">
              Share with people and groups
            </span>
          </div>
          
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              placeholder="Add people by email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-drive-blue/50 focus:border-drive-blue/50"
              disabled={isSharing}
            />
            
            <select
              value={role}
              onChange={handleRoleChange}
              className="px-3 py-2 border border-l-0 border-gray-300 bg-white text-gray-700 text-sm focus:outline-none"
              disabled={isSharing}
            >
              <option value="reader">Viewer</option>
              <option value="commenter">Commenter</option>
              <option value="writer">Editor</option>
            </select>
            
            <button
              onClick={handleShare}
              disabled={isSharing || !email.trim()}
              className="px-4 py-2 bg-drive-blue text-white rounded-r-md hover:bg-drive-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Share
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Get shareable link
            </p>
            
            <div className="flex items-center">
              <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-l-md text-gray-500 text-sm truncate">
                https://drive.google.com/file/d/{fileId}/view
              </div>
              
              <button
                onClick={copyShareLink}
                className="px-3 py-2 bg-white border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50 text-gray-600"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;