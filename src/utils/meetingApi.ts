export async function processMeetingAudio(file: File, format: string = "wav") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("format", format);

  const response = await fetch("http://localhost:8000/api/v1/process-meeting", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to process meeting audio");
  }
  const data = await response.json();
  // Return all relevant fields for frontend use
  return {
    transcript: data.transcript ?? "",
    speakers: Array.isArray(data.speakers) ? data.speakers : [],
    technical_terms: Array.isArray(data.technical_terms) ? data.technical_terms : [],
    error: data.error ?? null,
  };
}
