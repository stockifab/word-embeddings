# Embeddings

Notebooks to preprocess a text corpus, train a word embedding model, and extract the resulting embedding weights.

## Dataset

The notebooks were built against a single shard of [FineWeb-Edu](https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu) (10BT sample):

[`https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu/blob/main/sample/10BT/000_00000.parquet`](https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu/blob/main/sample/10BT/000_00000.parquet)

Download it and place it at `embeddings/data/000_00000.parquet` (path expected by `preprocessing.ipynb`):

```bash
mkdir -p data
curl -L -o data/000_00000.parquet \
  https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu/resolve/main/sample/10BT/000_00000.parquet
```

## Pipeline

Run the notebooks in order:

1. `preprocessing.ipynb` — tokenizes the corpus, builds the vocabulary (`token_to_id.pkl` / `id_to_token.pkl`), and writes training pairs to `groups.csv`.
2. `embeddings.ipynb` — trains the embedding model on `groups.csv`.
3. `extract-embeddings.ipynb` — extracts the trained weights to `embedding_weights.npy`.

The three output files (`embedding_weights.npy`, `token_to_id.pkl`, `id_to_token.pkl`) are what `website/backend` expects at `website/backend/files/`.
