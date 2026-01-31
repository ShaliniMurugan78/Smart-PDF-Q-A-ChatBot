from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import uuid

from config import UPLOAD_FOLDER
from rag.qa_chain import setup_rag, ask_question


# --------------------------------------------------
# App Setup
# --------------------------------------------------

app = Flask(__name__)
CORS(app)  # allow cross-origin requests (important for cloud)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# create uploads folder if not exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --------------------------------------------------
# Routes
# --------------------------------------------------

@app.route("/")
def home():
    """Render UI page"""
    return render_template("index.html")


# --------------------------------------------------
# Upload PDF Route
# --------------------------------------------------

@app.route("/upload", methods=["POST"])
def upload_pdf():
    """
    Handles PDF upload and builds RAG pipeline
    """

    try:
        if "pdf" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["pdf"]

        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"error": "Only PDF files allowed"}), 400

        # ---- unique filename (important for cloud/multiple users)
        unique_name = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)

        file.save(file_path)

        # ---- build RAG pipeline
        setup_rag(file_path)

        return jsonify({
            "message": "✅ PDF uploaded & processed successfully!"
        })

    except Exception as e:
        print(f"[UPLOAD ERROR] {e}")
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Ask Question Route
# --------------------------------------------------

@app.route("/ask", methods=["POST"])
def ask():
    """Ask question to chatbot"""

    try:
        data = request.get_json() or {}  # safer
        question = data.get("question")

        if not question:
            return jsonify({"error": "Question is empty"}), 400

        answer = ask_question(question)

        return jsonify({"answer": answer})

    except Exception as e:
        print(f"[ASK ERROR] {e}")
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Health Check (optional but good for hosting)
# --------------------------------------------------

@app.route("/health")
def health():
    return jsonify({"status": "ok"})


# --------------------------------------------------
# Run Server (local only)
# --------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
