from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/audio/{filename}")
async def get_audio(filename: str):
    audio_dir = "/e:/voicelink-app/data/audio"
    file_path = os.path.join(audio_dir, filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    return FileResponse(file_path)
