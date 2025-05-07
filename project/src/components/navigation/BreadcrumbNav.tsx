import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { driveService } from '../../services/driveService';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbNavProps {
  folderId: string;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ folderId }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  
  // Fetch folder info
  const { data: folder } = useQuery(
    ['folder', folderId],
    () => driveService.getFile(folderId),
    {
      enabled: !!folderId,
    }
  );
  
  // Build breadcrumb path
  useEffect(() => {
    const buildBreadcrumbs = async () => {
      if (!folder) return;
      
      const items: BreadcrumbItem[] = [
        { id: folder.id, name: folder.name },
      ];
      
      // If this folder has parents, fetch them recursively
      if (folder.parents && folder.parents.length > 0) {
        let currentParentId = folder.parents[0];
        let depth = 0;
        const maxDepth = 10; // Prevent infinite loops
        
        // Build the breadcrumb path up to the root
        while (currentParentId && currentParentId !== 'root' && depth < maxDepth) {
          try {
            const parent = await driveService.getFile(currentParentId);
            items.unshift({ id: parent.id, name: parent.name });
            
            if (!parent.parents || parent.parents.length === 0) {
              break;
            }
            
            currentParentId = parent.parents[0];
            depth++;
          } catch (error) {
            console.error('Error fetching parent folder:', error);
            break;
          }
        }
      }
      
      // Always add My Drive at the beginning
      items.unshift({ id: 'root', name: 'My Drive' });
      
      setBreadcrumbs(items);
    };
    
    if (folder) {
      buildBreadcrumbs();
    }
  }, [folder]);
  
  if (breadcrumbs.length === 0) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center flex-wrap text-sm text-gray-500 mt-1">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={item.id}>
            {index === 0 ? (
              <Link to="/" className="hover:text-drive-blue transition-colors">
                {item.name}
              </Link>
            ) : isLast ? (
              <span className="text-gray-700">{item.name}</span>
            ) : (
              <Link
                to={`/folder/${item.id}`}
                className="hover:text-drive-blue transition-colors"
              >
                {item.name}
              </Link>
            )}
            
            {!isLast && (
              <ChevronRight size={14} className="mx-1 text-gray-400" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BreadcrumbNav;