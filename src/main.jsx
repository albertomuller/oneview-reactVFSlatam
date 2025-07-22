import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import App from './App.jsx'
import DirectorsView from './views/DirectorsView.jsx'

// Simple routing based on URL parameters
const getAppComponent = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');
  const minimal = urlParams.get('minimal');
  
  // If accessing /directors or has directors view parameters
  if (window.location.pathname === '/directors' || (view === 'portfolio' && minimal === 'true')) {
    return <DirectorsView />;
  }
  
  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {getAppComponent()}
  </StrictMode>,
)
