import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserProgressProvider } from './contexts/UserProgressContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProgressProvider>
      <App />
    </UserProgressProvider>
  </StrictMode>,
);
