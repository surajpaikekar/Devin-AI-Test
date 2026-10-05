import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from google.genai import errors as genai_errors
from pydantic import BaseModel

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from llm import analyze_rfp  # noqa: E402
from parsers import SUPPORTED_EXTENSIONS, extract_text  # noqa: E402

logger = logging.getLogger("proposal_builder")

MAX_UPLOAD_BYTES = 25 * 1024 * 1024

app = FastAPI(title="Proposal Builder API")

allowed_origins = [
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class UploadResponse(BaseModel):
    filename: str
    summary: str
    requirements: list[str]


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/upload", response_model=UploadResponse)
async def upload(file: UploadFile = File(...)):
    filename = file.filename or ""
    extension = Path(filename).suffix.lower()
    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF, DOCX, or PPTX file.",
        )

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 25 MB limit.")

    try:
        text = await run_in_threadpool(extract_text, extension, data)
    except Exception:
        logger.exception("Failed to parse %s", filename)
        raise HTTPException(
            status_code=422, detail="Could not read the document. Is it a valid file?"
        )
    if not text:
        raise HTTPException(
            status_code=422,
            detail="No extractable text found in the document (it may be scanned images).",
        )

    try:
        analysis = await run_in_threadpool(analyze_rfp, text)
    except genai_errors.APIError as exc:
        logger.exception("Gemini request failed")
        if exc.code in (429, 503):
            raise HTTPException(
                status_code=503,
                detail="Gemini is temporarily busy. Please try again in a moment.",
            )
        raise HTTPException(
            status_code=502, detail="Failed to analyze the document with Gemini."
        )
    except Exception:
        logger.exception("Gemini request failed")
        raise HTTPException(
            status_code=502, detail="Failed to analyze the document with Gemini."
        )

    return UploadResponse(
        filename=filename,
        summary=analysis.summary,
        requirements=analysis.requirements,
    )
