from langchain.vectorstores import FAISS

# holds the vector database
_vector_db = None


def create_vectorstore(chunks, embeddings):
    """
    Create FAISS vector database from document chunks
    """
    global _vector_db

    _vector_db = FAISS.from_documents(
        documents=chunks,
        embedding=embeddings
    )


def get_vectorstore():
    """
    Return vector database instance
    """
    if _vector_db is None:
        raise ValueError("Vectorstore not initialized. Upload PDF first.")

    return _vector_db
