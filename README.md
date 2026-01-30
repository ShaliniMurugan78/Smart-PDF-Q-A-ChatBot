# 🧠 Smart PDF Q&A Chatbot

An AI-powered PDF Question & Answer chatbot with a modern, professional UI. Ask questions about your PDF documents and get instant, accurate answers with source citations powered by Groq's ultra-fast LLM.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/flask-2.0%2B-green)

## ✨ Features

- 🚀 **Lightning Fast**: Powered by Groq's ultra-fast inference engine (Llama 3.1 8B)
- 🎨 **Modern UI**: Beautiful glassmorphism design with dark/light mode
- 💬 **Smart Chat**: ChatGPT-style interface with streaming responses
- 🎤 **Voice Input**: Ask questions using your voice (browser-based)
- 📊 **Analytics Dashboard**: Real-time insights and performance metrics
- 🔍 **Source Citations**: RAG-based system with document references
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile

## 🎯 Tech Stack

### Backend
- **Framework**: Flask (Python)
- **LLM**: Groq (Llama 3.1 8B Instant)
- **Embeddings**: HuggingFace
- **Vector Database**: FAISS
- **PDF Processing**: LangChain

### Frontend
- **Styling**: TailwindCSS
- **Icons**: Lucide Icons
- **Markdown**: Marked.js
- **JavaScript**: Vanilla JS (no heavy frameworks)

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- Groq API Key ([Get it here](https://console.groq.com))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-pdf-chatbot.git
   cd smart-pdf-chatbot
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5000`

## 🎮 Usage

1. **Upload PDF**: Click the "Upload PDF" button in the sidebar
2. **Ask Questions**: Type or speak your question
3. **Get Answers**: Receive AI-powered responses with source citations
4. **Toggle Theme**: Switch between dark and light modes
5. **View Analytics**: Check the Insights panel for performance metrics

## 🖼️ Screenshots

### Light Mode
> [Add screenshot here]

### Dark Mode
> [Add screenshot here]

## 🏗️ Project Structure

```
smart-pdf-chatbot/
├── app.py                 # Flask application
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── style.css         # Custom styles & animations
│   └── script.js         # Frontend JavaScript
├── rag/
│   ├── loader.py         # PDF loading
│   ├── splitter.py       # Text chunking
│   ├── embeddings.py     # Embedding generation
│   ├── vectorstore.py    # Vector database
│   ├── retriever.py      # Document retrieval
│   └── qa_chain.py       # QA chain setup
└── uploads/              # Uploaded PDFs (gitignored)
```

## 🎨 Features Deep Dive

### Chat Experience
- **Streaming Text**: Word-by-word response animation
- **Typing Indicator**: Visual feedback while AI processes
- **Message Bubbles**: ChatGPT-style conversation interface
- **Copy Answers**: One-click copy functionality
- **Auto-scroll**: Automatic scroll to latest message

### UI/UX
- **Glassmorphism**: Modern transparent card design
- **Smooth Animations**: Fade-in, slide-up, bubble-pop effects
- **Custom Scrollbars**: Gradient purple scrollbars
- **Responsive Layout**: 3-column layout that adapts to screen size
- **Dark Mode**: Persistent theme toggle (saves to localStorage)

### Voice Features
- **Speech-to-Text**: Browser-based voice recognition
- **Supported Browsers**: Chrome, Edge, Safari (not Firefox)

## 🔧 Configuration

### Model Selection
You can change the LLM model in `config.py`:
```python
MODEL_NAME = "llama-3.1-8b-instant"  # or other supported Groq models
```

### Customization
- **Colors**: Modify gradient colors in `templates/index.html` (TailwindCSS config)
- **Animations**: Adjust timing in `static/style.css`
- **Quotes**: Update the quote array in `static/script.js`

## 🚀 Deployment

### Option 1: Heroku
1. Create a `Procfile`:
   ```
   web: gunicorn app:app
   ```
2. Deploy using Heroku CLI

### Option 2: Render
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Option 3: Docker
> [Add Docker instructions if needed]

## 📝 API Endpoints

- `POST /upload` - Upload and process PDF
- `POST /ask` - Submit question and get answer

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com) for the ultra-fast LLM inference
- [LangChain](https://langchain.com) for the RAG framework
- [TailwindCSS](https://tailwindcss.com) for the styling
- [Lucide Icons](https://lucide.dev) for beautiful icons

## 📧 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/YOUR_USERNAME/smart-pdf-chatbot](https://github.com/YOUR_USERNAME/smart-pdf-chatbot)

---

⭐ Star this repo if you find it helpful!
