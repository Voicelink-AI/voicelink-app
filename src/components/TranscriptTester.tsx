import { useState } from 'react';
import { VoiceLinkAPI } from '../services/api';

export default function TranscriptTester() {
  const [meetingId, setMeetingId] = useState('');
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testTranscriptEndpoint = async () => {
    if (!meetingId.trim()) {
      setError('Please enter a meeting ID');
      return;
    }

    setLoading(true);
    setError(null);
    setTranscriptData(null);

    try {
      console.log('Testing transcript endpoint for meeting:', meetingId);
      console.log('Making request to:', `http://localhost:8000/api/v1/meetings/${meetingId}/transcript`);
      
      const result = await VoiceLinkAPI.getTranscript(meetingId);
      console.log('Transcript endpoint result:', result);
      console.log('Response structure check:');
      console.log('- Has transcript property:', !!result.transcript);
      console.log('- Has transcript.segments:', !!result.transcript?.segments);
      console.log('- Has speakers property:', !!result.speakers);
      console.log('- Number of segments:', result.transcript?.segments?.length || 0);
      console.log('- Number of speakers:', result.speakers?.length || 0);
      
      setTranscriptData(result);
    } catch (err) {
      console.error('Transcript endpoint error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get transcript');
    } finally {
      setLoading(false);
    }
  };

  const testMeetingsList = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Getting meetings list...');
      const meetings = await VoiceLinkAPI.getMeetings();
      console.log('Available meetings:', meetings);
      
      if (meetings.length > 0) {
        const firstMeeting = meetings[0];
        setMeetingId(firstMeeting.meeting_id);
        console.log('Set meeting ID to:', firstMeeting.meeting_id);
      }
    } catch (err) {
      console.error('Failed to get meetings:', err);
      setError('Failed to get meetings list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Transcript Endpoint Tester</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting ID
            </label>
            <input
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter meeting ID"
            />
          </div>
          <button
            onClick={testMeetingsList}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
          >
            Get First Meeting ID
          </button>
          <button
            onClick={testTranscriptEndpoint}
            disabled={loading || !meetingId.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Transcript'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {transcriptData && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Transcript Data Received ✅</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Raw Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(transcriptData, null, 2)}
              </pre>
            </div>

            {transcriptData.transcript && transcriptData.transcript.segments && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Transcript Segments ({transcriptData.transcript.segments.length}):</h4>
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p><strong>Total Duration:</strong> {transcriptData.transcript.total_duration}s</p>
                  <p><strong>Speakers Detected:</strong> {transcriptData.transcript.speakers_detected}</p>
                  <p><strong>Processing Method:</strong> {transcriptData.transcript.processing_method}</p>
                </div>
                <div className="space-y-2">
                  {transcriptData.transcript.segments.map((segment: any, index: number) => (
                    <div key={index} className="bg-white border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          {segment.speaker_id || 'Unknown'}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {segment.start_time}s - {segment.end_time}s ({segment.duration?.toFixed(1)}s)
                        </span>
                        <span className="text-gray-500 text-sm">
                          {Math.round(segment.confidence * 100)}% confidence
                        </span>
                        {segment.language && (
                          <span className="text-gray-500 text-sm">
                            {segment.language}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{segment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {transcriptData.speakers && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Speaker Data ({transcriptData.speakers.length}):</h4>
                <div className="space-y-2">
                  {transcriptData.speakers.map((speaker: any, index: number) => (
                    <div key={index} className="bg-white border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                          {speaker.speaker_id}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Speaking time: {speaker.total_speaking_time}s
                        </span>
                        <span className="text-gray-500 text-sm">
                          Segments: {speaker.segment_count}
                        </span>
                      </div>
                      {speaker.segments && (
                        <div className="ml-4 space-y-1">
                          {speaker.segments.map((seg: any, segIndex: number) => (
                            <div key={segIndex} className="text-sm">
                              <span className="text-gray-500">[{seg.timestamp}]</span> {seg.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {transcriptData.transcript && transcriptData.transcript.full_text && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Full Transcript Text:</h4>
                <div className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
                  {transcriptData.transcript.full_text}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
