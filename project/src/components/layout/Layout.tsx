import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '../../services/tokenService';
import { User, Menu, X, LogOut, Home, Clock, Star, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = tokenService.getUser();
  
  const handleLogout = () => {
    tokenService.clearAll();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top navigation bar */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="bg-drive-blue rounded-md p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-white">
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" fill="currentColor"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                Drive Manager
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-drive-blue text-white flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user.name}
                </span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-drive-red hover:bg-red-50 rounded-full"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;