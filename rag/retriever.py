from .vectorstore import get_vectorstore


def get_retriever(k=3, search_type="similarity"):
    """
    Returns a retriever object

    k = number of chunks to fetch
    search_type:
        - similarity (default)
        - mmr (better diversity)
    """

    vector_db = get_vectorstore()

    return vector_db.as_retriever(
        search_type=search_type,
        search_kwargs={"k": k}
    )
