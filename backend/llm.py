import os

from google import genai
from google.genai import types
from pydantic import BaseModel

MAX_INPUT_CHARS = 500_000

PROMPT = """You are an expert proposal manager analyzing a Request for Proposal (RFP).

Read the RFP text below and return:
1. "summary": a clear, concise summary of the RFP in plain text (no markdown), covering the issuing organization, purpose, scope, and key dates/deadlines if present.
2. "requirements": a list of the key requirements extracted from the RFP, one requirement per item, each a short self-contained sentence (no bullet characters).

RFP TEXT:
\"\"\"
{text}
\"\"\"
"""


class RfpAnalysis(BaseModel):
    summary: str
    requirements: list[str]


_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not set")
        _client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(
                retry_options=types.HttpRetryOptions(attempts=4, max_delay=10)
            ),
        )
    return _client


def analyze_rfp(text: str) -> RfpAnalysis:
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    response = _get_client().models.generate_content(
        model=model,
        contents=PROMPT.format(text=text[:MAX_INPUT_CHARS]),
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=RfpAnalysis,
            temperature=0.2,
        ),
    )
    if response.parsed is not None:
        return response.parsed
    return RfpAnalysis.model_validate_json(response.text)
