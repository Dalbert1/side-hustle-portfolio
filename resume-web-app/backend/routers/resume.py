from fastapi import APIRouter

router = APIRouter(prefix="/api/resume", tags=["resume"])

@router.get("/experience")
def get_experience():
    return {"message": "Phase 2 — currently served from frontend JSON"}

@router.get("/skills")
def get_skills():
    return {"message": "Phase 2 — currently served from frontend JSON"}
