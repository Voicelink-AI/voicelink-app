import { useState, type ReactNode, useEffect } from 'react';
import { VoiceLinkAPI } from '../services/api';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
    { id: 'meetings', name: 'Meetings', icon: '📋' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'chat', name: 'AI Assistant', icon: '💬' },
    { id: 'system-monitor', name: 'System Monitor', icon: '🔧' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

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
          <div className="sidebar-logo">
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
        <header className="header">
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
