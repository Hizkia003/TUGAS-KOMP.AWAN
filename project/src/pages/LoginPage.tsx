import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { ToggleLeft as GoogleLogo, HardDrive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '../services/tokenService';
import { API_SCOPES, driveService } from '../services/driveService';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Save the access token
        tokenService.saveToken(
          tokenResponse.access_token,
          tokenResponse.expires_in
        );
        
        // Get user profile information
        const userInfo = await driveService.getUserInfo();
        tokenService.saveUser(userInfo);
        
        toast.success('Login successful!');
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
        toast.error('Failed to authenticate. Please try again.');
      }
    },
    onError: () => {
      toast.error('Login failed. Please try again.');
    },
    scope: API_SCOPES.join(' '),
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-drive-blue p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <HardDrive size={48} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Google Drive Manager</h1>
          <p className="mt-2 opacity-90">Access and manage your Drive files</p>
        </div>
        
        <div className="p-8">
          <div className="space-y-4">
            <p className="text-gray-600 text-center">
              Connect to your Google Drive account to get started
            </p>
            
            <button
              onClick={() => handleGoogleLogin()}
              className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-700 shadow-sm hover:bg-gray-50 transition duration-150 ease-in-out group"
            >
              <GoogleLogo size={20} className="mr-3 text-drive-blue" />
              <span className="font-medium">Sign in with Google</span>
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              This application requires access to your Google Drive to perform file operations.
              No files are stored on our servers.
            </p>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-500 max-w-md text-center">
        By using this application, you are granting permission to access and manage your Google Drive files.
        You can revoke access at any time through your Google Account settings.
      </p>
    </div>
  );
};

export default LoginPage;