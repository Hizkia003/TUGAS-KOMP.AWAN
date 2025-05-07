import React, { useRef, useEffect } from 'react';
import { Download, Edit, Share2, Trash2 } from 'lucide-react';

interface FileMenuProps {
  file: {
    id: string;
    name: string;
    mimeType: string;
  };
  onClose: () => void;
  onDownload: (e: React.MouseEvent) => void;
  onRename: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const FileMenu: React.FC<FileMenuProps> = ({
  file,
  onClose,
  onDownload,
  onRename,
  onShare,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Is this a folder?
  const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
  
  return (
    <div 
      ref={menuRef}
      className="absolute right-0 top-full mt-1 z-10 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        {!isFolder && (
          <button
            onClick={onDownload}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Download size={16} className="mr-2" />
            Download
          </button>
        )}
        
        <button
          onClick={onRename}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Edit size={16} className="mr-2" />
          Rename
        </button>
        
        <button
          onClick={onShare}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Share2 size={16} className="mr-2" />
          Share
        </button>
      </div>
      
      <div className="py-1">
        <button
          onClick={onDelete}
          className="flex items-center w-full px-4 py-2 text-sm text-drive-red hover:bg-red-50"
        >
          <Trash2 size={16} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default FileMenu;