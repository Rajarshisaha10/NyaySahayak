"""
Main FastAPI Application Entrypoint for NyayTarka (NyaySahayak).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.api import auth, cases, documents, verification

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NyaySahayak API",
    description="Verified Multi-Agent AI System for Courtroom Preparation",
    version="0.1.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(documents.router)
app.include_router(verification.router)

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "system": "NyaySahayak",
        "phase": "Phase 0 - Foundation & Legal Corpus Spec",
        "version": "0.1.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
