import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BuildHaul Caught Render Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            backgroundColor: '#171717',
            border: '1px solid #262626',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>
              Application Render Issue
            </h2>
            <p style={{ fontSize: '13px', color: '#a3a3a3', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              BuildHaul encountered an unexpected issue while initializing. Click below to reset stored state and refresh.
            </p>
            {this.state.error && (
              <pre style={{
                backgroundColor: '#0a0a0a',
                padding: '12px',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '11px',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '20px',
                border: '1px solid #262626'
              }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f59e0b',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Reload App
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#262626',
                  color: '#ffffff',
                  border: '1px solid #404040',
                  borderRadius: '10px',
                  fontWeight: '500',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <RootErrorBoundary>
          <App />
        </RootErrorBoundary>
      </StrictMode>,
    );
    (window as any).__BUILDHAUL_MOUNTED__ = true;
  } catch (err: any) {
    console.error('Fatal mount error:', err);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background-color: #0a0a0a; color: #f5f5f5; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-align: center; font-family: system-ui, sans-serif;">
        <div style="max-width: 480px; background: #171717; border: 1px solid #333; border-radius: 16px; padding: 32px;">
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">Initialization Issue</h2>
          <p style="font-size: 13px; color: #a3a3a3; margin-bottom: 20px;">${err?.message || 'Could not mount BuildHaul.'}</p>
          <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer;">
            Clear Cache & Reload
          </button>
        </div>
      </div>
    `;
  }
}
