import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MeetingDashboard from './components/MeetingDashboard';
import LiveMeetingRoom from './components/LiveMeetingRoom';
import MeetingDetailView from './components/MeetingDetailView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ChatInterface from './components/ChatInterface';
import SystemMonitor from './components/SystemMonitor';
import BlockchainVerifier from './components/BlockchainVerifier';
import Settings from './components/Settings';
import { VoiceLinkAPI } from './services/api';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'degraded' | 'down'>('down');
  const [isConnecting, setIsConnecting] = useState(true);

  const handleSelectMeeting = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentPage('meeting-detail');
  };

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      setIsConnecting(true);
      await VoiceLinkAPI.getHealth();
      setSystemHealth('healthy');
    } catch (err) {
      console.error('System health check failed:', err);
      setSystemHealth('down');
    } finally {
      setIsConnecting(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'meetings':
        return <MeetingDashboard onSelectMeeting={handleSelectMeeting} />;
      case 'meeting-detail':
        return selectedMeetingId ? (
          <MeetingDetailView meetingId={selectedMeetingId} />
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meeting selected</h3>
            <p className="text-gray-500">Please select a meeting from the meetings page</p>
            <button
              onClick={() => setCurrentPage('meetings')}
              className="btn btn-primary mt-4"
            >
              Go to Meetings
            </button>
          </div>
        );
      case 'live-meeting':
        return selectedMeetingId ? (
          <LiveMeetingRoom meetingId={selectedMeetingId} />
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meeting selected</h3>
            <p className="text-gray-500">Please select a meeting from the meetings page</p>
            <button
              onClick={() => setCurrentPage('meetings')}
              className="btn btn-primary mt-4"
            >
              Go to Meetings
            </button>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'chat':
        return <ChatInterface meetingId={selectedMeetingId || undefined} />;
      case 'system-monitor':
        return <SystemMonitor />;
      case 'blockchain':
        return <BlockchainVerifier meetingId={selectedMeetingId || undefined} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Show connection status while checking system health
  if (isConnecting && systemHealth === 'down') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting to VoiceLink API</h2>
          <p className="text-gray-600">Please ensure the backend server is running on http://localhost:8000</p>
        </div>
      </div>
    );
  }

  // Show error state if system is down
  if (systemHealth === 'down') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Connect</h2>
          <p className="text-gray-600 mb-6">
            Cannot connect to the VoiceLink API server. Please check that:
          </p>
          <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
            <li>• Backend server is running on http://localhost:8000</li>
            <li>• No firewall is blocking the connection</li>
            <li>• API server is properly configured</li>
          </ul>
          <button
            onClick={checkSystemHealth}
            className="btn btn-primary"
          >
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
