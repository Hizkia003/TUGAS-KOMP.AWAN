import React, { useState, useRef } from 'react';
import { X, Upload, File } from 'lucide-react';
import { driveService } from '../../services/driveService';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  onClose,
  folderId,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  if (!isOpen) return null;
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...fileArray]);
    }
  };
  
  // Remove file from list
  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    let successful = 0;
    let failed = 0;
    
    // Initialize progress for each file
    const initialProgress: Record<string, number> = {};
    files.forEach((file) => {
      initialProgress[file.name] = 0;
    });
    setProgress(initialProgress);
    
    // Upload each file
    for (const file of files) {
      try {
        // Upload with progress tracking
        await driveService.uploadFile(
          file,
          folderId,
          (progress) => {
            setProgress((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          }
        );
        successful++;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        failed++;
      }
    }
    
    // Show results
    if (successful > 0) {
      toast.success(`Uploaded ${successful} file${successful !== 1 ? 's' : ''} successfully`);
    }
    
    if (failed > 0) {
      toast.error(`Failed to upload ${failed} file${failed !== 1 ? 's' : ''}`);
    }
    
    // Refresh file list
    queryClient.invalidateQueries(['files', folderId]);
    
    // Reset state and close dialog
    setUploading(false);
    setFiles([]);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Upload Files</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            disabled={uploading}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
              disabled={uploading}
            />
            
            <Upload size={32} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 text-center">
              Click to select files or drag and drop them here
            </p>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Selected files ({files.length})
              </h3>
              
              <div className="max-h-48 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                  >
                    <div className="flex items-center">
                      <File size={16} className="text-drive-blue mr-2" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    
                    {uploading ? (
                      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-drive-blue rounded-full"
                          style={{ width: `${progress[file.name] || 0}%` }}
                        ></div>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.name);
                        }}
                        className="p-1 text-gray-400 hover:text-drive-red"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={uploading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="px-4 py-2 text-sm font-medium text-white bg-drive-blue rounded-md hover:bg-drive-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDialog;