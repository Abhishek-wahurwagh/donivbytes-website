from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import auth, courses, curriculum, public_courses, me, live_classes

app = FastAPI(
    title="DONIVBYTES API",
    description="Backend API for the DONIVBYTES learning platform.",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────

API_V1 = "/api/v1"

app.include_router(auth.router, prefix=API_V1)
app.include_router(courses.router, prefix=API_V1)
app.include_router(curriculum.router, prefix=API_V1)
app.include_router(public_courses.router, prefix=API_V1)
app.include_router(me.router, prefix=API_V1)
app.include_router(live_classes.router, prefix=API_V1)


# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health", tags=["health"], summary="Health check")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/v1/health", tags=["health"], summary="Versioned health check")
def health_v1() -> dict:
    return {"status": "ok"}
