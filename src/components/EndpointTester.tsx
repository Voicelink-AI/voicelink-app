import { useState } from 'react';

export default function EndpointTester() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const testEndpoint = async (name: string, url: string, options: RequestInit = {}) => {
    try {
      console.log(`🧪 Testing ${name}:`, url, options);
      
      const response = await fetch(url, options);
      const responseText = await response.text();
      
      console.log(`📊 ${name} response:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      });

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        parsedData = responseText;
      }

      setTestResults(prev => ({
        ...prev,
        [name]: {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          data: parsedData,
          headers: Object.fromEntries(response.headers.entries())
        }
      }));
    } catch (error) {
      console.error(`❌ ${name} error:`, error);
      setTestResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      }));
    }
  };

  const testAllEndpoints = async () => {
    setTestResults({});
    
    // Test basic endpoints first
    await testEndpoint('health', 'http://localhost:8000/health');
    await testEndpoint('api-status', 'http://localhost:8000/api/v1/status');
    await testEndpoint('meetings-list', 'http://localhost:8000/api/v1/meetings');
    await testEndpoint('analytics', 'http://localhost:8000/api/v1/analytics/overview');
  };

  const testFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    await testEndpoint('file-upload', 'http://localhost:8000/api/v1/upload-audio', {
      method: 'POST',
      body: formData
    });
  };

  const testMeetingCreationJSON = async () => {
    // Test with a mock file ID using the RECOMMENDED JSON endpoint
    await testEndpoint('create-meeting-json', 'http://localhost:8000/api/v1/create-meeting-from-file-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_id: 'test-file-id-' + Date.now(),
        title: 'Test Meeting from JSON'
      })
    });
  };

  const testMeetingCreationForm = async () => {
    // Test with a mock file ID using the form data endpoint
    const params = new URLSearchParams({
      file_id: 'test-file-id-' + Date.now(),
      title: 'Test Meeting from Form'
    });

    await testEndpoint('create-meeting-form', 'http://localhost:8000/api/v1/create-meeting-from-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
  };

  const testCompleteFlow = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    // Test the complete upload → create meeting flow
    try {
      // 1. Upload file
      console.log('🚀 Testing complete flow: Upload + Create Meeting');
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const uploadResponse = await fetch('http://localhost:8000/api/v1/upload-audio', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }
      
      const fileInfo = await uploadResponse.json();
      console.log('✅ File uploaded:', fileInfo);
      
      // 2. Create meeting using JSON endpoint
      const meetingResponse = await fetch('http://localhost:8000/api/v1/create-meeting-from-file-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_id: fileInfo.file_id,
          title: `Test Flow - ${selectedFile.name}`
        })
      });
      
      if (!meetingResponse.ok) {
        throw new Error(`Meeting creation failed: ${meetingResponse.status}`);
      }
      
      const meeting = await meetingResponse.json();
      console.log('✅ Meeting created:', meeting);
      
      setTestResults(prev => ({
        ...prev,
        'complete-flow': {
          success: true,
          status: 200,
          statusText: 'Complete Flow Success',
          data: { fileInfo, meeting }
        }
      }));
      
    } catch (error) {
      console.error('❌ Complete flow failed:', error);
      setTestResults(prev => ({
        ...prev,
        'complete-flow': {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">🧪 Endpoint Tester</h3>
      
      <div className="space-y-4 mb-6">
        <button onClick={testAllEndpoints} className="btn btn-primary">
          Test Basic Endpoints
        </button>
        
        <div className="flex gap-3 items-center">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
          <button 
            onClick={testFileUpload} 
            disabled={!selectedFile}
            className="btn btn-secondary"
          >
            Test File Upload
          </button>
        </div>
        
        <div className="flex gap-3">
          <button onClick={testMeetingCreationJSON} className="btn btn-secondary">
            Test Meeting Creation (JSON) ✅
          </button>
          <button onClick={testMeetingCreationForm} className="btn btn-secondary">
            Test Meeting Creation (Form)
          </button>
        </div>
        
        <button 
          onClick={testCompleteFlow} 
          disabled={!selectedFile}
          className="btn btn-primary w-full"
        >
          🚀 Test Complete Flow (Upload + Create Meeting)
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(testResults).map(([endpoint, result]) => (
          <div key={endpoint} className="border border-gray-200 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{endpoint}</h4>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.status || 'ERROR'}
                </span>
                <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? '✅' : '❌'}
                </span>
              </div>
            </div>
            
            {result.success ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-600">
                  Status: {result.status} {result.statusText}
                </div>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-h-32">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
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
