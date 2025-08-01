from .process_meeting import router as process_meeting_router
from .audio import router as audio_router

# ...existing code to include routers in your FastAPI app...
# app.include_router(process_meeting_router, prefix="/api/v1")
# app.include_router(audio_router, prefix="/api/v1")
