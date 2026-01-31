from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA

from .loader import load_pdf
from .splitter import split_docs
from .embeddings import get_embeddings
from .vectorstore import create_vectorstore
from .retriever import get_retriever

from config import GROQ_API_KEY, MODEL_NAME


qa_chain = None


def setup_rag(pdf_path):
    """
    Full pipeline:
    PDF → chunks → embeddings → vector DB → retriever → Groq LLM
    """

    global qa_chain

    # 1️⃣ Load
    docs = load_pdf(pdf_path)

    # 2️⃣ Split
    chunks = split_docs(docs)

    # 3️⃣ Embeddings
    embeddings = get_embeddings()

    # 4️⃣ Vector DB
    create_vectorstore(chunks, embeddings)

    # 5️⃣ Retriever
    retriever = get_retriever(k=3)

    # 6️⃣ Groq LLM
    llm = ChatGroq(
        groq_api_key=GROQ_API_KEY,
        model_name=MODEL_NAME,
        temperature=0
    )

    # 7️⃣ QA Chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",  # simple + fast
        return_source_documents=False
    )


def ask_question(question):
    """
    Ask question to RAG system
    """

    if qa_chain is None:
        return "⚠️ Please upload a PDF first."

    result = qa_chain.run(question)

    return result
