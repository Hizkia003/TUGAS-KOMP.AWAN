import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { File, Folder, MoreVertical, Star, Download, Edit, Trash2, Share2 } from 'lucide-react';
import { driveService } from '../../services/driveService';
import FileMenu from './FileMenu';
import toast from 'react-hot-toast';
import { formatFileSize, formatDate } from '../../utils/formatters';
import RenameDialog from '../dialogs/RenameDialog';
import ShareDialog from '../dialogs/ShareDialog';
import DeleteDialog from '../dialogs/DeleteDialog';

interface FileItemProps {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  thumbnailLink?: string;
  modifiedTime?: string;
  size?: string;
  starred?: boolean;
  shared?: boolean;
  webViewLink?: string;
  onUpdate: () => void;
}

interface FileListProps {
  files: FileItemProps[];
  onUpdate: () => void;
}

const FileList: React.FC<FileListProps> = ({ files, onUpdate }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<FileItemProps | null>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Handle file/folder click
  const handleItemClick = (file: FileItemProps) => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      navigate(`/folder/${file.id}`);
    } else if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  };
  
  // Handle menu toggle
  const toggleMenu = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === fileId ? null : fileId);
  };
  
  // Handle download
  const handleDownload = async (e: React.MouseEvent, file: FileItemProps) => {
    e.stopPropagation();
    try {
      toast.loading(`Downloading ${file.name}...`, { id: 'download' });
      await driveService.downloadFile(file.id, file.name);
      toast.success(`Downloaded ${file.name}`, { id: 'download' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file', { id: 'download' });
    }
  };
  
  // Open rename dialog
  const openRenameDialog = (e: React.MouseEvent, file: FileItemProps) => {
    e.stopPropagation();
    setActiveFile(file);
    setIsRenameOpen(true);
    setMenuOpen(null);
  };
  
  // Open share dialog
  const openShareDialog = (e: React.MouseEvent, file: FileItemProps) => {
    e.stopPropagation();
    setActiveFile(file);
    setIsShareOpen(true);
    setMenuOpen(null);
  };
  
  // Open delete dialog
  const openDeleteDialog = (e: React.MouseEvent, file: FileItemProps) => {
    e.stopPropagation();
    setActiveFile(file);
    setIsDeleteOpen(true);
    setMenuOpen(null);
  };
  
  // Handle successful action
  const handleActionSuccess = () => {
    setActiveFile(null);
    onUpdate();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
        <div className="col-span-6 md:col-span-5">Name</div>
        <div className="hidden md:block md:col-span-3">Last Modified</div>
        <div className="col-span-5 md:col-span-3">Size</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {files.map((file) => {
          const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
          
          return (
            <div
              key={file.id}
              className="grid grid-cols-12 py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer items-center"
              onClick={() => handleItemClick(file)}
            >
              <div className="col-span-6 md:col-span-5 flex items-center overflow-hidden">
                <div className="flex-shrink-0 mr-3">
                  {isFolder ? (
                    <Folder size={20} className="text-drive-yellow" />
                  ) : file.thumbnailLink ? (
                    <img
                      src={file.thumbnailLink}
                      alt={file.name}
                      className="w-6 h-6 object-cover rounded"
                    />
                  ) : (
                    <File size={20} className="text-drive-blue" />
                  )}
                </div>
                <div className="truncate">
                  <span className="font-medium text-gray-800">{file.name}</span>
                  <div className="flex items-center mt-1">
                    {file.starred && (
                      <Star size={14} className="text-drive-yellow mr-1" />
                    )}
                    {file.shared && (
                      <Share2 size={14} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block md:col-span-3 text-sm text-gray-500">
                {file.modifiedTime ? formatDate(file.modifiedTime) : '-'}
              </div>
              
              <div className="col-span-5 md:col-span-3 text-sm text-gray-500">
                {isFolder ? (
                  'Folder'
                ) : file.size ? (
                  formatFileSize(parseInt(file.size))
                ) : (
                  '-'
                )}
              </div>
              
              <div className="col-span-1 flex justify-end relative">
                <button
                  onClick={(e) => toggleMenu(e, file.id)}
                  className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
                >
                  <MoreVertical size={18} />
                </button>
                
                {menuOpen === file.id && (
                  <FileMenu
                    file={file}
                    onClose={() => setMenuOpen(null)}
                    onDownload={(e) => handleDownload(e, file)}
                    onRename={(e) => openRenameDialog(e, file)}
                    onShare={(e) => openShareDialog(e, file)}
                    onDelete={(e) => openDeleteDialog(e, file)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Dialogs */}
      {activeFile && (
        <>
          <RenameDialog
            isOpen={isRenameOpen}
            onClose={() => setIsRenameOpen(false)}
            fileId={activeFile.id}
            currentName={activeFile.name}
            onSuccess={handleActionSuccess}
          />
          
          <ShareDialog
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            fileId={activeFile.id}
            fileName={activeFile.name}
            onSuccess={handleActionSuccess}
          />
          
          <DeleteDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            fileId={activeFile.id}
            fileName={activeFile.name}
            onSuccess={handleActionSuccess}
          />
        </>
      )}
    </div>
  );
};

export default FileList;