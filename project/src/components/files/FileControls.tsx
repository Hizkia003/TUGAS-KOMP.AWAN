import React, { useState, useRef } from 'react';
import { RefreshCw, Upload, FolderPlus, Grid, List } from 'lucide-react';
import UploadDialog from '../dialogs/UploadDialog';
import NewFolderDialog from '../dialogs/NewFolderDialog';
import clsx from 'clsx';

interface FileControlsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  currentFolderId?: string;
}

const FileControls: React.FC<FileControlsProps> = ({
  onRefresh,
  isRefreshing,
  currentFolderId,
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle view mode toggle
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className={clsx(
            "p-2 rounded-md text-gray-600 hover:bg-gray-100", 
            { "animate-spin": isRefreshing }
          )}
          disabled={isRefreshing}
          aria-label="Refresh"
        >
          <RefreshCw size={18} />
        </button>
        
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-drive-blue text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-drive-blue/90 transition-colors"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Upload</span>
        </button>
        
        <button
          onClick={() => setIsNewFolderOpen(true)}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <FolderPlus size={16} />
          <span className="hidden sm:inline">New Folder</span>
        </button>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={toggleViewMode}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
        >
          {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
        </button>
      </div>
      
      {/* Upload dialog */}
      <UploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        folderId={currentFolderId}
      />
      
      {/* New folder dialog */}
      <NewFolderDialog
        isOpen={isNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
        parentFolderId={currentFolderId}
      />
    </div>
  );
};

export default FileControls;