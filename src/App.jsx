import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import TreeCanvas from './components/TreeCanvas';
import Login from './components/Login';
import './index.css';
import '@xyflow/react/dist/style.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const isAuth = localStorage.getItem('tf-auth') === 'true';
    setIsAuthenticated(isAuth);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('tf-auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('tf-auth');
    setIsAuthenticated(false);
  };

  if (isLoading) return null; // Or a loading spinner

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <TreeCanvas onLogout={handleLogout} />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
