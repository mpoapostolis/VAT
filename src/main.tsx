import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'jotai';
import App from './App';
import { ThemeProvider } from './components/ui/ThemeProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <ThemeProvider defaultTheme="light">
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);