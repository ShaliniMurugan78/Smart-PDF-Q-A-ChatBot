from flask import Flask, render_template, request, jsonify
import os

from config import UPLOAD_FOLDER
from rag.qa_chain import setup_rag, ask_question


# --------------------------------------------------
# App Setup
# --------------------------------------------------

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# create uploads folder if not exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --------------------------------------------------
# Routes
# --------------------------------------------------

@app.route("/")
def home():
    """
    Render UI page
    """
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

        if not file.filename.endswith(".pdf"):
            return jsonify({"error": "Only PDF files allowed"}), 400

        # save file
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)

        # setup RAG pipeline
        setup_rag(file_path)

        return jsonify({
            "message": "✅ PDF uploaded & processed successfully!"
        })

    except Exception as e:
        print(f"Error uploading PDF: {e}")
        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------------------------
# Ask Question Route
# --------------------------------------------------

@app.route("/ask", methods=["POST"])
def ask():
    """
    Ask question to chatbot
    """

    try:
        data = request.get_json()

        question = data.get("question")

        if not question:
            return jsonify({"error": "Question is empty"}), 400

        answer = ask_question(question)

        return jsonify({
            "answer": answer
        })

    except Exception as e:
        print(f"Error processing question: {e}")
        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------------------------
# Run Server
# --------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
