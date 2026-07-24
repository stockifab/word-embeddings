from src.embedding import get_closest_words, norm_embedding


def closest_words(token: str, top_k=10, exclude_tokens=()):
    return get_closest_words(norm_embedding(token), top_k, exclude_tokens)


def analogy(word1: str, word2: str, word3: str, top_k=10):
    return get_closest_words(
        norm_embedding(word1) - norm_embedding(word2) + norm_embedding(word3),
        top_k,
        (word1, word2, word3),
    )
