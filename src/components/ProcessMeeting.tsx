import React, { useState } from "react";
import { processMeetingAudio } from "../utils/meetingApi";

function ProcessMeeting() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await processMeetingAudio(file);
      setTranscript(result.transcript);
      setSpeakers(result.speakers);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {transcript && <div>Transcript: {transcript}</div>}
      {speakers.length > 0 && (
        <div>
          <h4>Speakers:</h4>
          <ul>
            {speakers.map((s, idx) => (
              <li key={idx}>{s.speaker_id}: {s.segments.map((seg: { text: string }) => seg.text).join(", ")}</li>
            ))}
          </ul>
        </div>
      )}
      {error && <div style={{color: "red"}}>{error}</div>}
    </div>
  );
}

export default ProcessMeeting;
