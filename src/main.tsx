// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { VapiProvider } from './contexts/VapiContextNew';
import { AuthProvider } from './contexts/auth/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VapiProvider>
          <App />
        </VapiProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
