from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Dylan Albert Resume API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/resume")
def get_resume():
    return {"message": "Phase 2 endpoint — frontend reads from local JSON in Phase 1"}
