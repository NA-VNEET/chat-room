import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './config/routes.jsx';
import { Toaster } from 'react-hot-toast';
import { ChatProvider } from './context/ChatContext.jsx';
import './index.css';

const root = document.getElementById('root');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <Toaster position="top-center" />
        <AppRoutes />
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>
);
