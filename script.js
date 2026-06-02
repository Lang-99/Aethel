// Aethel v4.0 - Full AI Assistant

// State
let searchMode = localStorage.getItem('aethel_search_mode') === 'true';
let currentTheme = localStorage.getItem('aethel_theme') || 'dark';
let currentLanguage = localStorage.getItem('aethel_language') || 'id';
let conversationHistory = [];
let currentUser = null;

// DOM Elements
const messageContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typing');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const searchModeBtn = document.getElementById('searchModeBtn');
const searchIndicator = document.getElementById('searchIndicator');
const searchModeToggle = document.getElementById('searchModeToggle');
const languageSelect = document.getElementById('languageSelect');
const attachBtn = document.getElementById('attachBtn');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const previewModal = document.getElementById('previewModal');
const previewFrame = document.getElementById('previewFrame');

// Translations
const translations = {
    id: { typing: "Aethel sedang mengetik...", error: "Maaf, terjadi kesalahan. Coba lagi." },
    en: { typing: "Aethel is typing...", error: "Sorry, something went wrong. Try again." },
    es: { typing: "Aethel está escribiendo...", error: "Lo siento, algo salió mal. Inténtalo de nuevo." },
    fr: { typing: "Aethel écrit...", error: "Désolé, une erreur s'est produite. Réessayez." },
    ar: { typing: "إيثيل يكتب...", error: "عذرًا، حدث خطأ. حاول مرة أخرى." },
    zh: { typing: "Aethel正在输入...", error: "抱歉，出错了。请重试。" },
    hi: { typing: "एथेल टाइप कर रहा है...", error: "क्षमा करें, कुछ गलत हो गया। फिर से कोशिश करें।" }
};

// Initialize
function init() {
    // Apply settings
    applyTheme(currentTheme);
    updateSearchModeUI();
    
    // Set language select
    if (languageSelect) languageSelect.value = currentLanguage;
    if (searchModeToggle) searchModeToggle.checked = searchMode;
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
    document.querySelector('.close-modal')?.addEventListener('click', () => settingsModal.style.display = 'none');
    document.querySelector('.close-preview')?.addEventListener('click', () => previewModal.style.display = 'none');
    
    searchModeBtn.addEventListener('click', toggleSearchMode);
    if (searchModeToggle) {
        searchModeToggle.addEventListener('change', (e) => {
            searchMode = e.target.checked;
            localStorage.setItem('aethel_search_mode', searchMode);
            updateSearchModeUI();
        });
    }
    
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('aethel_language', currentLanguage);
            typingIndicator.textContent = translations[currentLanguage]?.typing || translations.id.typing;
        });
    }
    
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('aethel_theme', theme);
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // File attachment
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Auto resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.style.display = 'none';
        if (e.target === previewModal) previewModal.style.display = 'none';
    });
}

function applyTheme(theme) {
    currentTheme = theme;
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    } else {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    }
}

function toggleSearchMode() {
    searchMode = !searchMode;
    localStorage.setItem('aethel_search_mode', searchMode);
    if (searchModeToggle) searchModeToggle.checked = searchMode;
    updateSearchModeUI();
    addSystemMessage(searchMode ? '🌐 Mode pencarian aktif' : '📘 Mode pencarian nonaktif');
}

function updateSearchModeUI() {
    if (searchIndicator) {
        searchIndicator.textContent = searchMode ? 'On' : 'Off';
        searchIndicator.className = `search-indicator ${searchMode ? 'on' : 'off'}`;
    }
}

function addSystemMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant';
    msgDiv.innerHTML = `<div class="message-content" style="background: none; font-style: italic; font-size: 12px;">${escapeHtml(text)}</div>`;
    messageContainer.appendChild(msgDiv);
    scrollToBottom();
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    filePreview.innerHTML = '';
    files.forEach(file => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            previewItem.appendChild(img);
        }
        
        const span = document.createElement('span');
        span.textContent = file.name;
        previewItem.appendChild(span);
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.background = 'none';
        removeBtn.style.border = 'none';
        removeBtn.style.cursor = 'pointer';
        removeBtn.onclick = () => previewItem.remove();
        previewItem.appendChild(removeBtn);
        
        filePreview.appendChild(previewItem);
    });
}

function addMessage(content, role, files = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    
    let htmlContent = `<div class="message-content">`;
    
    // Add files/images
    if (files.length > 0) {
        files.forEach(file => {
            if (file.type?.startsWith('image/')) {
                htmlContent += `<img src="${URL.createObjectURL(file)}" class="message-image">`;
            } else {
                htmlContent += `<div class="file-attachment">📎 ${escapeHtml(file.name)}</div>`;
            }
        });
    }
    
    // Process content for code blocks with preview
    let processedContent = escapeHtml(content);
    const codeRegex = /```(\w*)\n([\s\S]*?)```/g;
    processedContent = processedContent.replace(codeRegex, (match, lang, code) => {
        const isHtml = lang === 'html' || lang === 'HTML';
        return `<div class="code-block"><pre><code>${escapeHtml(code)}</code></pre>${isHtml ? `<button class="preview-btn" onclick="previewHTML(\`${escapeHtml(code).replace(/`/g, '\\`')}\`)">🔍 Preview HTML</button>` : ''}</div>`;
    });
    
    htmlContent += processedContent;
    htmlContent += `</div>`;
    
    msgDiv.innerHTML = htmlContent;
    messageContainer.appendChild(msgDiv);
    scrollToBottom();
}

window.previewHTML = function(htmlContent) {
    previewFrame.innerHTML = htmlContent;
    previewModal.style.display = 'flex';
};

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    const container = document.querySelector('.chat-container');
    container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    const files = fileInput.files ? Array.from(fileInput.files) : [];
    
    if (!text && files.length === 0) return;
    
    // Add user message
    addMessage(text || '📎 Mengirim file', 'user', files);
    
    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    filePreview.innerHTML = '';
    fileInput.value = '';
    
    // Prepare files data
    let filesData = [];
    for (const file of files) {
        const base64 = await fileToBase64(file);
        filesData.push({
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64
        });
    }
    
    conversationHistory.push({ 
        role: 'user', 
        content: text,
        files: filesData 
    });
    
    typingIndicator.style.display = 'block';
    scrollToBottom();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: conversationHistory,
                language: currentLanguage,
                searchMode: searchMode
            })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const aiReply = data.reply;
        addMessage(aiReply, 'assistant');
        conversationHistory.push({ role: 'assistant', content: aiReply });
        
        if (conversationHistory.length > 30) conversationHistory = conversationHistory.slice(-30);
    } catch (err) {
        const errorMsg = translations[currentLanguage]?.error || translations.id.error;
        addMessage(errorMsg, 'assistant');
    } finally {
        typingIndicator.style.display = 'none';
        scrollToBottom();
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Google Sign In callback
window.handleGoogleSignIn = function(response) {
    currentUser = response;
    addSystemMessage(`✅ Login sebagai ${response.email || 'user'} via Google`);
};

// Start
init();
