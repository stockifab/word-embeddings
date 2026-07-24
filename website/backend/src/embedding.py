import pickle
from pathlib import Path
from functools import lru_cache
import numpy as np

EMBEDDING_WEIGHTS_PATH = Path(__file__).parent.parent / Path("files/embedding_weights.npy")
TOKEN_TO_ID_PATH = Path(__file__).parent.parent / Path("files/token_to_id.pkl")
ID_TO_TOKEN_PATH = Path(__file__).parent.parent / Path("files/id_to_token.pkl")


@lru_cache(maxsize=1)
def __get_token_to_id():
    with Path(TOKEN_TO_ID_PATH).open("rb") as f:
        return pickle.load(f)


@lru_cache(maxsize=1)
def __get_id_to_token():
    with Path(ID_TO_TOKEN_PATH).open("rb") as f:
        return pickle.load(f)


def token_to_id(token):
    return __get_token_to_id()[token.lower()]


def id_to_token(id):
    return __get_id_to_token()[id]


@lru_cache(maxsize=1)
def embeddings():
    return np.load(EMBEDDING_WEIGHTS_PATH)


def normalize(v: np.ndarray):
    return v / np.linalg.norm(v)


def norm_embedding(token: str):
    return normalize(embeddings()[token_to_id(token)])


def get_closest_words(query_embedding: np.ndarray, top_k=10, exclude_tokens=()):
    weights_norm = embeddings() / np.maximum(
        np.linalg.norm(embeddings(), axis=1, keepdims=True), 1e-12
    )
    query_norm = query_embedding / max(np.linalg.norm(query_embedding), 1e-12)
    similarities = weights_norm @ query_norm

    if isinstance(exclude_tokens, str):
        exclude_tokens = (exclude_tokens,)
    excluded_ids = {token_to_id(token) for token in exclude_tokens}
    for token_id in excluded_ids:
        similarities[token_id] = -np.inf

    top_k = min(top_k, len(similarities) - len(excluded_ids))
    top_ids = np.argpartition(similarities, -top_k)[-top_k:]
    top_ids = top_ids[np.argsort(similarities[top_ids])[::-1]]
    return [(id_to_token(i), float(similarities[i])) for i in top_ids]
