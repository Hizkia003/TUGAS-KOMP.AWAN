import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, Clock, Star, Share2, HardDrive, Plus, Database } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: 'My Drive', icon: <HardDrive size={18} />, path: '/' },
    { name: 'Recent', icon: <Clock size={18} />, path: '/recent' },
    { name: 'Starred', icon: <Star size={18} />, path: '/starred' },
    { name: 'Shared with me', icon: <Share2 size={18} />, path: '/shared' },
  ];
  
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-20 w-64 bg-white transform shadow-lg md:shadow-none md:translate-x-0 md:static transition-transform duration-300 ease-in-out flex flex-col h-full',
        {
          'translate-x-0': isOpen,
          '-translate-x-full': !isOpen,
        }
      )}
    >
      {/* Mobile close button */}
      <div className="flex items-center justify-end p-2 md:hidden">
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Create new button */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm transition duration-150">
          <Plus size={18} />
          <span>Create New</span>
        </button>
      </div>
      
      {/* Navigation links */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition duration-150',
                  {
                    'bg-drive-blue/10 text-drive-blue': isActivePath(item.path),
                    'text-gray-700 hover:bg-gray-100': !isActivePath(item.path),
                  }
                )}
                onClick={() => onClose()}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Storage usage */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Database size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">Storage</span>
        </div>
        
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>2.4 GB used</span>
          <span>15 GB</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-drive-blue h-2 rounded-full"
            style={{ width: '16%' }}
          ></div>
        </div>
        
        <button className="mt-3 w-full text-center text-xs text-drive-blue hover:text-drive-blue/80 font-medium">
          Get more storage
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;