import { useState, useEffect } from 'react';
import { tokenService } from '../services/tokenService';

export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = tokenService.getToken();
      const expiry = tokenService.getExpiry();
      
      if (token && expiry) {
        // Check if token is expired
        const isExpired = new Date().getTime() > parseInt(expiry);
        
        if (!isExpired) {
          setIsAuthenticated(true);
        } else {
          // Token expired, remove it
          tokenService.removeToken();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
}