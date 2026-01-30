// ============================================
// STATE MANAGEMENT
// ============================================

let uploadedPDFs = [];
let chatHistory = [];
let currentTheme = localStorage.getItem('theme') || 'light';
let queryCount = 0;
let isVoiceRecording = false;

// AI Quotes
const quotes = [
    "Knowledge is power. Information is liberating.",
    "The only source of knowledge is experience.",
    "An investment in knowledge pays the best interest.",
    "Education is the most powerful weapon which you can use to change the world.",
    "The beautiful thing about learning is that no one can take it away from you."
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    displayRandomQuote();
    initLucideIcons();
});

function initTheme() {
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon('sun');
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon('moon');
    }
}

function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function displayRandomQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl = document.getElementById('quote-text');
    if (quoteEl) {
        quoteEl.textContent = `"${randomQuote}"`;
    }
}

// ============================================
// THEME TOGGLE
// ============================================

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);

    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon('sun');
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon('moon');
    }
}

function updateThemeIcon(icon) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.setAttribute('data-lucide', icon);
        lucide.createIcons();
    }
}

// ============================================
// TAB NAVIGATION
// ============================================

function switchTab(tabName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`)?.classList.add('active');

    // Update page content
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page-${tabName}`)?.classList.add('active');

    // Reinit icons after tab switch
    setTimeout(() => lucide.createIcons(), 100);
}

// ============================================
// PDF UPLOAD
// ============================================

async function uploadPDF() {
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a PDF file first');
        return;
    }

    // Show progress
    const progressDiv = document.getElementById('upload-progress');
    progressDiv.classList.remove('hidden');

    let formData = new FormData();
    formData.append('pdf', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        // Hide progress
        progressDiv.classList.add('hidden');

        if (response.ok) {
            // Add to PDF list
            uploadedPDFs.push({
                name: file.name,
                date: new Date().toLocaleString()
            });

            updatePDFList();
            updateDocCount();

            // Show success with checkmark animation
            showSuccessMessage(result.message);

            // Clear file input
            fileInput.value = '';

            // Switch to chat tab
            switchTab('chat');
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        progressDiv.classList.add('hidden');
        alert('Upload failed: ' + error.message);
    }
}

function updatePDFList() {
    const pdfList = document.getElementById('pdf-list');

    if (uploadedPDFs.length === 0) {
        pdfList.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400 italic">No documents uploaded yet</p>';
        return;
    }

    pdfList.innerHTML = uploadedPDFs.map((pdf, index) => `
        <div class="pdf-item">
            <div class="flex items-center space-x-2 flex-1 min-w-0">
                <i data-lucide="file-text" class="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0"></i>
                <span class="pdf-name">${pdf.name}</span>
            </div>
            <button onclick="deletePDF(${index})" class="delete-btn">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
    `).join('');

    lucide.createIcons();
}

function deletePDF(index) {
    if (confirm('Delete this document?')) {
        uploadedPDFs.splice(index, 1);
        updatePDFList();
        updateDocCount();
    }
}

function updateDocCount() {
    const docCount = document.getElementById('doc-count');
    if (docCount) {
        docCount.textContent = uploadedPDFs.length;
    }
}

function showSuccessMessage(message) {
    const chatBox = document.getElementById('chatBox');
    const successDiv = document.createElement('div');
    successDiv.className = 'text-center py-4';
    successDiv.innerHTML = `
        <div class="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl success-checkmark">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            <span>${message}</span>
        </div>
    `;
    chatBox.appendChild(successDiv);
    lucide.createIcons();
    scrollToBottom();
}

// ============================================
// CHAT FUNCTIONALITY
// ============================================

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        askQuestion();
    }
}

async function askQuestion() {
    const questionInput = document.getElementById('question');
    const chatBox = document.getElementById('chatBox');
    const question = questionInput.value.trim();

    if (!question) {
        return;
    }

    // Add user message
    addMessage(question, 'user');
    questionInput.value = '';

    // Show typing indicator
    const typingId = showTypingIndicator();

    const startTime = Date.now();

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        // Remove typing indicator
        removeTypingIndicator(typingId);

        const latency = ((Date.now() - startTime) / 1000).toFixed(2) + 's';

        if (data.error) {
            addMessage('Error: ' + data.error, 'bot', latency);
        } else {
            // Add bot response with streaming effect
            await addMessageWithStreaming(data.answer, 'bot', latency);

            // Update analytics
            queryCount++;
            updateAnalytics(latency);
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        addMessage('Error: ' + error.message, 'bot');
    }
}

function addMessage(text, type, latency = null) {
    const chatBox = document.getElementById('chatBox');

    // Clear placeholder if exists
    if (chatBox.querySelector('.text-center')) {
        chatBox.innerHTML = '';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = type === 'user'
        ? '<i data-lucide="user" class="w-4 h-4 text-white"></i>'
        : '<i data-lucide="bot" class="w-4 h-4 text-white"></i>';

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="flex-1">
            <div class="message-bubble">
                <div class="message-content">${escapeHtml(text)}</div>
            </div>
            <div class="message-timestamp">${timestamp}${latency ? ' • ' + latency : ''}</div>
        </div>
        ${type === 'bot' ? `
            <button onclick="copyMessage(this)" class="copy-btn ml-2" title="Copy">
                <i data-lucide="copy" class="w-4 h-4"></i>
            </button>
        ` : ''}
    `;

    chatBox.appendChild(messageDiv);
    lucide.createIcons();
    scrollToBottom();

    // Store in history
    chatHistory.push({ type, text, timestamp });
}

async function addMessageWithStreaming(text, type, latency) {
    const chatBox = document.getElementById('chatBox');

    // Clear placeholder if exists
    if (chatBox.querySelector('.text-center')) {
        chatBox.innerHTML = '';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = '<i data-lucide="bot" class="w-4 h-4 text-white"></i>';
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="flex-1">
            <div class="message-bubble">
                <div class="message-content"></div>
            </div>
            <div class="message-timestamp">${timestamp} • ${latency}</div>
        </div>
        <button onclick="copyMessage(this)" class="copy-btn ml-2" title="Copy">
            <i data-lucide="copy" class="w-4 h-4"></i>
        </button>
    `;

    chatBox.appendChild(messageDiv);
    lucide.createIcons();

    const contentDiv = messageDiv.querySelector('.message-content');

    // Stream text word by word
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
        contentDiv.textContent += (i > 0 ? ' ' : '') + words[i];
        scrollToBottom();
        await sleep(30); // Adjust speed here
    }

    // Store in history
    chatHistory.push({ type, text, timestamp });
}

function showTypingIndicator() {
    const chatBox = document.getElementById('chatBox');
    const typingDiv = document.createElement('div');
    const typingId = 'typing-' + Date.now();
    typingDiv.id = typingId;
    typingDiv.className = 'message bot';

    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i data-lucide="bot" class="w-4 h-4 text-white"></i>
        </div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;

    chatBox.appendChild(typingDiv);
    lucide.createIcons();
    scrollToBottom();

    return typingId;
}

function removeTypingIndicator(typingId) {
    const typingDiv = document.getElementById(typingId);
    if (typingDiv) {
        typingDiv.remove();
    }
}

function clearChat() {
    if (confirm('Clear all messages?')) {
        const chatBox = document.getElementById('chatBox');
        chatBox.innerHTML = `
            <div class="text-center text-gray-500 dark:text-gray-400 py-12">
                <i data-lucide="message-square" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
                <p>Upload a PDF and start asking questions!</p>
            </div>
        `;
        chatHistory = [];
        lucide.createIcons();
    }
}

function copyMessage(button) {
    const messageContent = button.parentElement.querySelector('.message-content').textContent;
    navigator.clipboard.writeText(messageContent).then(() => {
        const icon = button.querySelector('i');
        icon.setAttribute('data-lucide', 'check');
        lucide.createIcons();

        setTimeout(() => {
            icon.setAttribute('data-lucide', 'copy');
            lucide.createIcons();
        }, 2000);
    });
}

function scrollToBottom() {
    const chatBox = document.getElementById('chatBox');
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ============================================
// VOICE INPUT
// ============================================

function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice input is not supported in your browser');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    const voiceBtn = document.getElementById('voice-btn');
    const questionInput = document.getElementById('question');

    recognition.onstart = () => {
        voiceBtn.classList.add('voice-recording');
        isVoiceRecording = true;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        questionInput.value = transcript;
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('voice-recording');
        isVoiceRecording = false;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceBtn.classList.remove('voice-recording');
        isVoiceRecording = false;
    };

    recognition.start();
}

// ============================================
// ANALYTICS
// ============================================

function updateAnalytics(latency) {
    const latencyEl = document.getElementById('last-latency');
    const queriesEl = document.getElementById('total-queries');

    if (latencyEl) {
        latencyEl.textContent = latency;
    }

    if (queriesEl) {
        queriesEl.textContent = queryCount;
    }
}

// ============================================
// UTILITIES
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// DOWNLOAD/EXPORT (Bonus feature)
// ============================================

function downloadChatHistory() {
    const content = chatHistory.map(msg =>
        `[${msg.timestamp}] ${msg.type.toUpperCase()}: ${msg.text}`
    ).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
