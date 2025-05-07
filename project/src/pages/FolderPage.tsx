import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { driveService } from '../services/driveService';
import FileList from '../components/files/FileList';
import FileControls from '../components/files/FileControls';
import SearchBar from '../components/common/SearchBar';
import BreadcrumbNav from '../components/navigation/BreadcrumbNav';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorDisplay from '../components/common/ErrorDisplay';
import EmptyState from '../components/common/EmptyState';
import { ArrowLeft } from 'lucide-react';

const FolderPage: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch folder info
  const { 
    data: folderInfo,
    isLoading: folderLoading,
    isError: folderError,
  } = useQuery(
    ['folder', folderId],
    () => driveService.getFile(folderId as string),
    {
      enabled: !!folderId,
    }
  );
  
  // Fetch files in this folder
  const { 
    data: files, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery(
    ['files', folderId, searchQuery],
    () => driveService.listFiles(folderId, searchQuery),
    {
      enabled: !!folderId,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Handle back navigation
  const handleBack = () => {
    if (folderInfo?.parents && folderInfo.parents.length > 0) {
      navigate(`/folder/${folderInfo.parents[0]}`);
    } else {
      navigate('/');
    }
  };

  const isLoaded = !folderLoading && !isLoading;
  const hasError = folderError || isError;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-fade-in">
      <button 
        onClick={handleBack} 
        className="inline-flex items-center text-drive-blue hover:underline mb-4"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {folderLoading ? 'Loading...' : folderInfo?.name || 'Folder'}
          </h1>
          
          {isLoaded && !hasError && (
            <BreadcrumbNav folderId={folderId as string} />
          )}
        </div>
        
        <div className="w-full md:w-80">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search in this folder..." 
          />
        </div>
      </div>
      
      <FileControls 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
        currentFolderId={folderId}
      />
      
      <div className="mt-6">
        {isLoading ? (
          <LoadingIndicator message="Loading files..." />
        ) : isError ? (
          <ErrorDisplay 
            message="Failed to load files" 
            error={error as Error} 
            retryAction={refetch} 
          />
        ) : files?.length === 0 ? (
          <EmptyState 
            title="No files found" 
            description={searchQuery ? "No files match your search" : "This folder is empty"}
            actionText={searchQuery ? "Clear search" : "Upload a file"}
            onAction={searchQuery ? () => setSearchQuery('') : undefined}
          />
        ) : (
          <FileList files={files} onUpdate={refetch} />
        )}
      </div>
    </div>
  );
};

export default FolderPage;