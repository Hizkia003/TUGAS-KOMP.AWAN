import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { driveService } from '../services/driveService';
import FileList from '../components/files/FileList';
import FileControls from '../components/files/FileControls';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorDisplay from '../components/common/ErrorDisplay';

const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch files from root directory
  const { 
    data: files, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery(
    ['files', searchQuery],
    () => driveService.listFiles(undefined, searchQuery),
    {
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Drive</h1>
          <p className="text-gray-500 mt-1">Manage your Google Drive files</p>
        </div>
        
        <div className="w-full md:w-80">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search files..." 
          />
        </div>
      </div>
      
      <FileControls 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
        currentFolderId="root" 
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
            description={searchQuery ? "No files match your search" : "Your Drive is empty"}
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

export default DashboardPage;