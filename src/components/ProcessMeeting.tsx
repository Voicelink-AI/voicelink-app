import React, { useState } from "react";
import { processMeetingAudio } from "../utils/meetingApi";

function ProcessMeeting() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [technicalTerms, setTechnicalTerms] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await processMeetingAudio(file);
      setTranscript(result.transcript);
      setSpeakers(result.speakers);
      setTechnicalTerms(result.technical_terms);
      setError(result.error);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {transcript && typeof transcript === "string" && <div>Transcript: {transcript}</div>}
      {transcript && typeof transcript === "object" && (
        <div>
          <h4>Transcript (raw):</h4>
          <pre>{JSON.stringify(transcript, null, 2)}</pre>
        </div>
      )}
      {speakers.length > 0 && (
        <div>
          <h4>Speakers:</h4>
          <ul>
            {speakers.map((s, idx) => (
              <li key={idx}>
                {s.speaker_id}: {Array.isArray(s.segments) ? s.segments.map((seg: { text: string }) => seg.text).join(", ") : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
      {technicalTerms.length > 0 && (
        <div>
          <h4>Technical Terms:</h4>
          <ul>
            {technicalTerms.map((term, idx) => (
              <li key={idx}>{term}</li>
            ))}
          </ul>
        </div>
      )}
      {error && typeof error === "string" && <div style={{ color: "red" }}>{error}</div>}
      {error && typeof error === "object" && (
        <div style={{ color: "red" }}>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ProcessMeeting;
