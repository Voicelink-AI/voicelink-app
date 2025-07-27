import { useState, type ReactNode, useEffect } from 'react';
import { VoiceLinkAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../utils/translations';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const { language } = useTheme();
  const { t } = useTranslation(language);

  const navigation = [
    { id: 'dashboard', name: t('nav.dashboard'), icon: '🏠' },
    { id: 'meetings', name: t('nav.meetings'), icon: '📋' },
    { id: 'analytics', name: t('nav.analytics'), icon: '📊' },
    { id: 'chat', name: t('nav.chat'), icon: '💬' },
    { id: 'system-monitor', name: t('nav.systemMonitor'), icon: '🔧' },
    { id: 'settings', name: t('nav.settings'), icon: '⚙️' },
  ];

  // Scroll to top when page changes
  useEffect(() => {
    // Try multiple scroll targets to ensure we get to the top
    const scrollToTop = () => {
      // 1. Try to scroll the main content container
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
      
      // 2. Try to scroll the content area
      const contentArea = document.querySelector('.content-area');
      if (contentArea) {
        contentArea.scrollTop = 0;
      }
      
      // 3. Try to scroll any scrollable parent
      const appLayout = document.querySelector('.app-layout');
      if (appLayout) {
        appLayout.scrollTop = 0;
      }
      
      // 4. Scroll the document body
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // 5. Window scroll as final fallback
      window.scrollTo(0, 0);
    };
    
    // Use setTimeout to ensure DOM is updated
    setTimeout(scrollToTop, 0);
  }, [currentPage]);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await VoiceLinkAPI.getHealth();
        setApiStatus('connected');
      } catch (err) {
        setApiStatus('disconnected');
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (apiStatus) {
      case 'connected':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-600',
          text: 'Connected'
        };
      case 'connecting':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-600',
          text: 'Connecting...'
        };
      case 'disconnected':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-600',
          text: 'Disconnected'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-blue)' }}>
            🎙️ <span>VoiceLink</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Modern API Status Bar */}
        <div className="fixed top-0 left-0 w-screen z-50">
          <div className="api-status-bar flex items-center justify-between px-6 py-3"
            style={{
              background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: '0.02em',
              boxShadow: '0 2px 8px rgba(59,130,246,0.08)',
              width: '100vw',
              minHeight: '48px',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🔗</span>
              <span>API Status:</span>
              <span className={`rounded px-3 py-1 font-mono text-xs ${apiStatus === 'connected' ? 'bg-green-600' : apiStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {apiStatus === 'connected' ? 'Connected' : apiStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="text-xs opacity-80">VoiceLink v1.0</span>
            </div>
          </div>
        </div>

        <header className="header" style={{ marginTop: '56px' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-secondary lg:hidden"
            >
              ☰
            </button>
            <h1 className="header-title">
              {navigation.find(item => item.id === currentPage)?.name || 'VoiceLink'}
            </h1>
          </div>
          
          <div className="header-actions">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">API Status:</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
                <span className={`text-sm ${statusInfo.textColor}`}>{statusInfo.text}</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
