I developed a Smart AI PDF Q&A Chatbot using a modular Retrieval-Augmented Generation (RAG) architecture. The system is designed with clearly separated components for document loading, text chunking, embedding generation, vector storage, semantic retrieval, and LLM-based answer generation.

The pipeline begins by extracting and splitting PDF content into manageable chunks. These chunks are converted into vector embeddings and stored in a vector database to enable efficient semantic search. When a user submits a query, the retriever identifies the most relevant document segments, which are then passed to a Large Language Model via the Groq Cloud API to generate accurate, context-aware responses.

The QA chain functions as the orchestration layer, coordinating retrieval and LLM interaction to ensure responses are grounded in the uploaded document. This modular design improves maintainability, scalability, and performance while enabling fast and reliable document-based question answering.
---
### Architecture

The project follows a modular RAG pipeline:

Loader – Extracts text from uploaded PDFs

Splitter – Splits large text into manageable chunks

Embeddings – Converts text chunks into vector representations

Vector Store – Stores embeddings for semantic search

Retriever – Retrieves relevant chunks based on user query

QA Chain – Combines retrieved context with user query and generates answer using Groq LLM

---

### Tech Stack

Python

Flask

Retrieval-Augmented Generation (RAG)

Groq Cloud API (LLM inference)

Vector Database

Embeddings Model

LangChain

---

### How It Works

User uploads a PDF document

Text is extracted and split into chunks

Chunks are converted into embeddings

Embeddings are stored in a vector database

When a user asks a question:

Relevant chunks are retrieved

Context + Question are sent to Groq LLM

AI generates a grounded response

