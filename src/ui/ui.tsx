/**
 * UI Entry Point - Professional Dashboard Creator
 * Integrates with existing PluginController architecture
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { MainApp } from '../components/MainApp';
import '../components/MainApp.css';

// ============================================================================
// GLOBAL STYLES
// ============================================================================

const globalStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100vh;
    overflow: hidden;
  }
`;

// ============================================================================
// APPLICATION WRAPPER
// ============================================================================

const App: React.FC = () => {
  return (
    <>
      <style>{globalStyles}</style>
      <MainApp />
    </>
  );
};

// ============================================================================
// RENDER APPLICATION
// ============================================================================

console.log('[UI] Dashboard Creator UI initializing...');

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
  console.log('[UI] Dashboard Creator UI rendered successfully');
} else {
  console.error('[UI] Root container not found');
}
