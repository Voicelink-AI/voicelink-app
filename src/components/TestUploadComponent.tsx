import { useState } from 'react';

export default function TestUploadComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('🚀 Starting upload process...');
      
      // 1. Upload file
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('📤 Uploading file:', file.name);
      const uploadResponse = await fetch('http://localhost:8000/api/v1/upload-audio', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
      }
      
      const fileInfo = await uploadResponse.json();
      console.log('✅ File uploaded successfully:', fileInfo);
      
      // 2. Create meeting using the RECOMMENDED JSON endpoint
      console.log('📋 Creating meeting with file_id:', fileInfo.file_id);
      const meetingResponse = await fetch('http://localhost:8000/api/v1/create-meeting-from-file-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_id: fileInfo.file_id,
          title: `Meeting from ${file.name}`
        })
      });
      
      if (!meetingResponse.ok) {
        const errorText = await meetingResponse.text();
        throw new Error(`Meeting creation failed: ${meetingResponse.status} - ${errorText}`);
      }
      
      const meeting = await meetingResponse.json();
      console.log('✅ Meeting created successfully:', meeting);
      
      // 3. Verify the meeting appears in the list
      console.log('📋 Fetching all meetings to verify...');
      const meetingsResponse = await fetch('http://localhost:8000/api/v1/meetings?limit=10');
      const allMeetings = await meetingsResponse.json();
      console.log('✅ Total meetings in system:', allMeetings.length);
      
      setResult({ 
        fileInfo, 
        meeting, 
        totalMeetings: allMeetings.length,
        allMeetings: allMeetings.slice(0, 3) // Show first 3 meetings
      });
      
    } catch (err) {
      console.error('❌ Error during upload/meeting creation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setUploading(false);
    }
  };

  const testEndpoints = async () => {
    setError(null);
    try {
      // Test basic endpoints
      console.log('🧪 Testing endpoints...');
      
      const healthResponse = await fetch('http://localhost:8000/health');
      const health = await healthResponse.json();
      console.log('✅ Health:', health);
      
      const statusResponse = await fetch('http://localhost:8000/api/v1/status');
      const status = await statusResponse.json();
      console.log('✅ Status:', status);
      
      const meetingsResponse = await fetch('http://localhost:8000/api/v1/meetings');
      const meetings = await meetingsResponse.json();
      console.log('✅ Meetings:', meetings.length);
      
      const analyticsResponse = await fetch('http://localhost:8000/api/v1/analytics/overview');
      const analytics = await analyticsResponse.json();
      console.log('✅ Analytics:', analytics);
      
      alert('All endpoints working! Check console for details.');
      
    } catch (err) {
      console.error('❌ Endpoint test failed:', err);
      setError(`Endpoint test failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-4">🧪 VoiceLink Upload Tester</h3>
      
      <div className="space-y-4">
        {/* Test Endpoints */}
        <div>
          <button onClick={testEndpoints} className="btn btn-secondary">
            🔍 Test All Endpoints
          </button>
          <p className="text-xs text-gray-500 mt-1">Check browser console for detailed results</p>
        </div>
        
        {/* File Upload */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">File Upload & Meeting Creation</h4>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          {file && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
          
          <button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className={`mt-3 btn ${uploading ? 'bg-gray-400' : 'btn-primary'}`}
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              'Upload & Create Meeting'
            )}
          </button>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex">
              <div className="text-red-400 mr-2">❌</div>
              <div>
                <h4 className="text-sm font-medium text-red-800">Error</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Success Display */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <div className="flex">
              <div className="text-green-400 mr-2">✅</div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-800 mb-2">Success!</h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-green-700">File Uploaded:</p>
                    <p className="text-green-600 font-mono text-xs">ID: {result.fileInfo.file_id}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-700">Meeting Created:</p>
                    <p className="text-green-600 font-mono text-xs">ID: {result.meeting.meeting_id}</p>
                    <p className="text-green-600">Title: {result.meeting.title}</p>
                    <p className="text-green-600">Status: {result.meeting.status}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-700">System Status:</p>
                    <p className="text-green-600">Total meetings in system: {result.totalMeetings}</p>
                  </div>
                  
                  {result.allMeetings.length > 0 && (
                    <div>
                      <p className="font-medium text-green-700">Recent meetings:</p>
                      <div className="max-h-32 overflow-y-auto">
                        {result.allMeetings.map((meeting: any, index: number) => (
                          <div key={index} className="text-xs text-green-600 border-l-2 border-green-300 pl-2 mb-1">
                            {meeting.title} ({meeting.status})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 border-t pt-3">
          <p><strong>Expected flow:</strong></p>
          <p>1. Upload audio file → Get file_id</p>
          <p>2. Create meeting from file_id → Get meeting_id</p>
          <p>3. Meeting appears in meetings list</p>
          <p>4. Analytics update with real data</p>
        </div>
      </div>
    </div>
  );
}
