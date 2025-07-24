import { useState } from 'react';
import { VoiceLinkAPI } from '../services/api';

export default function APIDebugger() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState(false);

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    setTesting(true);
    try {
      const result = await testFn();
      setTestResults(prev => ({
        ...prev,
        [name]: { success: true, data: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [name]: { 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        }
      }));
    }
    setTesting(false);
  };

  const testAllEndpoints = async () => {
    setTestResults({});
    
    // Test health endpoint
    await testEndpoint('health', () => VoiceLinkAPI.getHealth());
    
    // Test meetings endpoint
    await testEndpoint('meetings', () => VoiceLinkAPI.getMeetings());
    
    // Test analytics endpoint
    await testEndpoint('analytics', () => VoiceLinkAPI.getAnalyticsOverview());
    
    // Test system status
    await testEndpoint('status', () => VoiceLinkAPI.getSystemStatus());
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">API Endpoint Debugger</h3>
      
      <button
        onClick={testAllEndpoints}
        disabled={testing}
        className="btn btn-primary mb-4"
      >
        {testing ? 'Testing...' : 'Test All Endpoints'}
      </button>
      
      <div className="space-y-4">
        {Object.entries(testResults).map(([endpoint, result]) => (
          <div key={endpoint} className="border border-gray-200 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{endpoint}</h4>
              <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? '✅ Success' : '❌ Failed'}
              </span>
            </div>
            
            {result.success ? (
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {result.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
