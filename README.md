# Word Embeddings

Training word embeddings from scratch and presenting them through an interactive, slide-based website (closest-words search, word arithmetic / analogies).

[Try it live](https://word-embeddings.happierbit.com/)

## Structure

- [`embeddings/`](embeddings) — Jupyter notebooks for preprocessing a text corpus, training an embedding model, and extracting the resulting embedding weights.
- [`website/`](website) — Interactive demo site.
  - `website/backend` — FastAPI service that serves closest-words and analogy queries over the trained embeddings.
  - `website/frontend` — React + Vite slide deck that walks through the concepts and talks to the backend.

## Getting started

### Train / extract embeddings

```bash
cd embeddings
uv sync
uv run jupyter lab
```

See [`embeddings/README.md`](embeddings/README.md) for the dataset download and notebook run order. This produces `embedding_weights.npy`, `token_to_id.pkl`, and `id_to_token.pkl`, which the backend expects at `website/backend/files/`.

### Run the website

```bash
# Backend
cd website/backend
uv sync
uv run uvicorn main:app --reload

# Frontend
cd website/frontend
pnpm install
pnpm dev
```

Or build the combined production image:

```bash
cd website
docker build -t word-embeddings .
docker run -p 8000:8000 word-embeddings
```

Note: the Docker image does not include `website/backend/files/*` — mount or copy the generated embedding files in separately.

# AI Usage Declaration

AI was used to:
- write this README
- make the demo website responsive because I forgot to think about smaller screens :/
- certain texts for the demo website, to help explain word embeddings
- assist with conceptual questions about word embeddings
