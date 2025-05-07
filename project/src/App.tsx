import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthCheck } from './hooks/useAuthCheck';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FolderPage from './pages/FolderPage';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';


function App() {
  const { isAuthenticated, isLoading } = useAuthCheck();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Layout>
              <DashboardPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
      <Route 
        path="/folder/:folderId" 
        element={
          isAuthenticated ? (
            <Layout>
              <FolderPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;