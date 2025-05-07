// Simple service to manage access tokens in localStorage

const TOKEN_KEY = 'google_drive_token';
const EXPIRY_KEY = 'google_drive_token_expiry';
const USER_KEY = 'google_drive_user';

export const tokenService = {
  // Save token with expiry time
  saveToken: (token: string, expiresIn: number) => {
    localStorage.setItem(TOKEN_KEY, token);
    // Convert expiresIn (seconds) to a future timestamp (milliseconds)
    const expiryTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get expiry timestamp
  getExpiry: (): string | null => {
    return localStorage.getItem(EXPIRY_KEY);
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  },

  // Save user profile data
  saveUser: (user: any) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user profile data
  getUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Remove user profile data
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  // Clear all auth data
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    localStorage.removeItem(USER_KEY);
  }
};