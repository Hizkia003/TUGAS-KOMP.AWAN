import axios from 'axios';
import { tokenService } from './tokenService';

// Base URL for Google Drive API
const API_BASE_URL = 'https://www.googleapis.com/drive/v3';

// Create axios instance with auth headers
const createAxiosInstance = () => {
  const token = tokenService.getToken();
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// API scopes needed for the application
export const API_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

// Drive service functions
export const driveService = {
  // List files/folders (with optional folder ID for navigation)
  listFiles: async (folderId?: string, searchQuery?: string) => {
    const api = createAxiosInstance();
    
    let query = "trashed=false";
    
    // If folder ID is provided, list contents of that folder
    if (folderId) {
      query += ` and '${folderId}' in parents`;
    } else {
      // For root, show only files in root folder
      query += " and 'root' in parents";
    }

    // Add search query if provided
    if (searchQuery) {
      query += ` and name contains '${searchQuery}'`;
    }

    const response = await api.get('/files', {
      params: {
        q: query,
        fields: 'files(id, name, mimeType, iconLink, thumbnailLink, webViewLink, modifiedTime, size, starred, shared)',
        pageSize: 100,
        orderBy: 'folder,name',
      },
    });

    return response.data.files;
  },

  // Get file details
  getFile: async (fileId: string) => {
    const api = createAxiosInstance();
    const response = await api.get(`/files/${fileId}`, {
      params: {
        fields: 'id, name, mimeType, description, starred, shared, webViewLink, thumbnailLink, size, modifiedTime, parents, properties',
      },
    });
    return response.data;
  },

  // Create new folder
  createFolder: async (name: string, parentId?: string) => {
    const api = createAxiosInstance();
    const metadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : ['root'],
    };
    
    const response = await api.post('/files', metadata);
    return response.data;
  },
  
  // Rename file/folder
  renameFile: async (fileId: string, newName: string) => {
    const api = createAxiosInstance();
    const response = await api.patch(`/files/${fileId}`, {
      name: newName,
    });
    return response.data;
  },
  
  // Move file to trash
  trashFile: async (fileId: string) => {
    const api = createAxiosInstance();
    const response = await api.patch(`/files/${fileId}`, {
      trashed: true,
    });
    return response.data;
  },

  // Delete file permanently
  deleteFile: async (fileId: string) => {
    const api = createAxiosInstance();
    await api.delete(`/files/${fileId}`);
    return true;
  },

  // Upload file
  uploadFile: async (file: File, folderId?: string, onProgress?: (progress: number) => void) => {
    const token = tokenService.getToken();
    
    // Step 1: Get a resumable upload URL
    const initResponse = await axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      {
        name: file.name,
        parents: folderId ? [folderId] : ['root'],
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Get the upload URL from the response headers
    const uploadUrl = initResponse.headers.location;
    
    // Step 2: Upload the file content
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      
      // Progress handler
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('Upload failed due to network error'));
      };
      
      xhr.send(file);
    });
  },

  // Download file
  downloadFile: async (fileId: string, fileName: string) => {
    const token = tokenService.getToken();
    
    const response = await axios.get(`${API_BASE_URL}/files/${fileId}?alt=media`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    
    // Create blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Get user info
  getUserInfo: async () => {
    const token = tokenService.getToken();
    
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.data;
  },

  // Share a file with another user
  shareFile: async (fileId: string, email: string, role: 'reader' | 'writer' | 'commenter') => {
    const api = createAxiosInstance();
    
    const response = await api.post(`/files/${fileId}/permissions`, {
      type: 'user',
      role: role,
      emailAddress: email,
    });
    
    return response.data;
  }
};