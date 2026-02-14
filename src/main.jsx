import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import { Toaster } from 'react-hot-toast'
import './index.css'
import { ErrorBoundary } from 'react-error-boundary'

// Lazy load pages to isolate which one crashes
import App from './App.jsx'

function Crash({ error }) {
  return (
    <div style={{ padding: '40px', color: 'red', fontFamily: 'monospace' }}>
      <h2>Page Error:</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{error.stack}</pre>
      <a href="#/" onClick={() => window.location.reload()}>← Back to Home (Reload)</a>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Crash}>
      <HashRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
