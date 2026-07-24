from pathlib import Path

import fastapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from src.service import analogy, closest_words
from pydantic import BaseModel

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GetClosestWordsRequest(BaseModel):
    token: str


class GetAnalogyRequest(BaseModel):
    word1: str
    word2: str
    word3: str


@app.post(
    "/closest-words",
    response_model=list[tuple[str, float]],
    responses={400: {"description": "The word not found in the embedding vocabulary."}},
)
def get_closest_words_endpoint(request: GetClosestWordsRequest):
    try:
        return closest_words(request.token, exclude_tokens=(request.token,))
    except KeyError:
        raise fastapi.HTTPException(
            status_code=400,
            detail="The word not found in the embedding vocabulary.",
        )


@app.post(
    "/analogy",
    response_model=list[tuple[str, float]],
    responses={
        400: {"description": "One or more words not found in the embedding vocabulary."}
    },
)
def get_analogy_endpoint(request: GetAnalogyRequest):
    try:
        return analogy(request.word1, request.word2, request.word3)
    except KeyError:
        raise fastapi.HTTPException(
            status_code=400,
            detail="One or more words not found in the embedding vocabulary.",
        )


STATIC_DIR = Path(__file__).parent / "static"
if STATIC_DIR.is_dir():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
