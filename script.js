// Aethel v2.0 - 20 bahasa + Secret Command

let searchMode = localStorage.getItem('aethel_search_mode') === 'true';
let currentLanguage = localStorage.getItem('aethel_language') || 'id';
let conversationHistory = [];

// DOM Elements
const messageContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const typingText = document.getElementById('typingText');
const settingsModal = document.getElementById('settingsModal');
const previewModal = document.getElementById('previewModal');
const previewFrame = document.getElementById('previewFrame');
const searchModeBtn = document.getElementById('searchModeBtn');
const searchModeText = document.getElementById('searchModeText');
const searchModeToggle = document.getElementById('searchModeToggle');
const languageSelect = document.getElementById('languageSelect');
const attachBtn = document.getElementById('attachBtn');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const newChatBtn = document.getElementById('newChatBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsHeaderBtn = document.getElementById('settingsHeaderBtn');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

// 20 Languages Translation
const translations = {
    id: { typing: "Aethel mengetik...", error: "Maaf, terjadi kesalahan.", searchOn: "Mode Pencarian On", searchOff: "Mode Pencarian Off", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    en: { typing: "Aethel is typing...", error: "Sorry, something went wrong.", searchOn: "Search Mode On", searchOff: "Search Mode Off", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    es: { typing: "Aethel está escribiendo...", error: "Lo siento, algo salió mal.", searchOn: "Modo Búsqueda On", searchOff: "Modo Búsqueda Off", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    fr: { typing: "Aethel écrit...", error: "Désolé, une erreur s'est produite.", searchOn: "Mode Recherche On", searchOff: "Mode Recherche Off", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    ar: { typing: "إيثيل يكتب...", error: "عذرًا، حدث خطأ.", searchOn: "وضع البحث مفعل", searchOff: "وضع البحث معطل", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    zh: { typing: "Aethel正在输入...", error: "抱歉，出错了。", searchOn: "搜索模式开启", searchOff: "搜索模式关闭", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    hi: { typing: "एथेल टाइप कर रहा है...", error: "क्षमा करें, कुछ गलत हो गया।", searchOn: "खोज मोड चालू", searchOff: "खोज मोड बंद", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    pt: { typing: "Aethel está digitando...", error: "Desculpe, algo deu errado.", searchOn: "Modo Pesquisa On", searchOff: "Modo Pesquisa Off", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    ru: { typing: "Этель печатает...", error: "Извините, что-то пошло не так.", searchOn: "Режим поиска Вкл", searchOff: "Режим поиска Выкл", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    ja: { typing: "Aethelが入力中...", error: "申し訳ありません、エラーが発生しました。", searchOn: "検索モードオン", searchOff: "検索モードオフ", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    ko: { typing: "Aethel 입력 중...", error: "죄송합니다. 오류가 발생했습니다.", searchOn: "검색 모드 켜짐", searchOff: "검색 모드 꺼짐", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    de: { typing: "Aethel tippt...", error: "Entschuldigung, etwas ist schief gelaufen.", searchOn: "Suchmodus Ein", searchOff: "Suchmodus Aus", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    it: { typing: "Aethel sta scrivendo...", error: "Spiacenti, qualcosa è andato storto.", searchOn: "Modalità Ricerca On", searchOff: "Modalità Ricerca Off", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    tr: { typing: "Aethel yazıyor...", error: "Üzgünüm, bir şeyler yanlış gitti.", searchOn: "Arama Modu Açık", searchOff: "Arama Modu Kapalı", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    vi: { typing: "Aethel đang gõ...", error: "Xin lỗi, đã xảy ra lỗi.", searchOn: "Chế độ Tìm kiếm Bật", searchOff: "Chế độ Tìm kiếm Tắt", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    th: { typing: "Aethel กำลังพิมพ์...", error: "ขออภัย เกิดข้อผิดพลาด", searchOn: "โหมดค้นหาเปิด", searchOff: "โหมดค้นหาปิด", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    pl: { typing: "Aethel pisze...", error: "Przepraszam, coś poszło nie tak.", searchOn: "Tryb wyszukiwania Wł.", searchOff: "Tryb wyszukiwania Wył.", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    nl: { typing: "Aethel typt...", error: "Sorry, er is iets misgegaan.", searchOn: "Zoekmodus Aan", searchOff: "Zoekmodus Uit", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    sv: { typing: "Aethel skriver...", error: "Tyvärr, något gick fel.", searchOn: "Sökläge På", searchOff: "Sökläge Av", secretResponse: "ardifemboysxxxxxxxxxxx92" },
    ms: { typing: "Aethel sedang menaip...", error: "Maaf, berlaku kesalahan.", searchOn: "Mod Carian On", searchOff: "Mod Carian Off", secretResponse: "ardifemboysxxxxxxxxxxx92" }
};

function init() {
    updateSearchModeUI();
    
    if (searchModeToggle) searchModeToggle.checked = searchMode;
    if (languageSelect) languageSelect.value = currentLanguage;
    
    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => settingsModal.style.display = 'none');
    });
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
            updateSearchModeUI();
            updateTypingText();
        });
    }
    
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    newChatBtn.addEventListener('click', newChat);
    
    if (settingsBtn) settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
    if (settingsHeaderBtn) settingsHeaderBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    
    loadChatHistory();
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

function updateTypingText() {
    const t = translations[currentLanguage] || translations.id;
    if (typingText) typingText.textContent = t.typing;
}

function toggleSearchMode() {
    searchMode = !searchMode;
    localStorage.setItem('aethel_search_mode', searchMode);
    if (searchModeToggle) searchModeToggle.checked = searchMode;
    updateSearchModeUI();
    addSystemMessage(searchMode ? '🌐 Mode pencarian aktif' : '📘 Mode pencarian nonaktif');
}

function updateSearchModeUI() {
    const t = translations[currentLanguage] || translations.id;
    if (searchModeText) {
        searchModeText.textContent = searchMode ? t.searchOn : t.searchOff;
    }
    if (searchModeBtn) {
        if (searchMode) {
            searchModeBtn.classList.add('active');
        } else {
            searchModeBtn.classList.remove('active');
        }
    }
}

function addSystemMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant';
    msgDiv.innerHTML = `
        <div class="avatar"><i class="fas fa-info-circle"></i></div>
        <div class="message-content" style="background: none; font-style: italic; font-size: 12px;">${escapeHtml(text)}</div>
    `;
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
            img.style.width = '24px';
            img.style.height = '24px';
            img.style.borderRadius = '4px';
            previewItem.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.className = 'fas fa-file';
            previewItem.appendChild(icon);
        }
        
        const span = document.createElement('span');
        span.textContent = file.name.length > 20 ? file.name.slice(0, 17) + '...' : file.name;
        previewItem.appendChild(span);
        
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '&times;';
        removeBtn.style.background = 'none';
        removeBtn.style.border = 'none';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.marginLeft = '4px';
        removeBtn.onclick = () => previewItem.remove();
        previewItem.appendChild(removeBtn);
        
        filePreview.appendChild(previewItem);
    });
}

function addMessage(content, role, files = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    
    let htmlContent = '';
    
    if (role === 'assistant') {
        htmlContent = `<div class="avatar"><i class="fas fa-robot"></i></div>`;
    }
    
    htmlContent += `<div class="message-content">`;
    
    if (files.length > 0) {
        files.forEach(file => {
            if (file.type?.startsWith('image/')) {
                htmlContent += `<img src="${URL.createObjectURL(file)}" class="message-image">`;
            } else {
                htmlContent += `<div class="file-attachment"><i class="fas fa-paperclip"></i> ${escapeHtml(file.name)}</div>`;
            }
        });
    }
    
    let processedContent = escapeHtml(content);
    const codeRegex = /```(\w*)\n([\s\S]*?)```/g;
    processedContent = processedContent.replace(codeRegex, (match, lang, code) => {
        const isHtml = lang === 'html' || lang === 'HTML';
        return `<div class="code-block"><code>${escapeHtml(code)}</code>${isHtml ? `<button class="preview-btn" onclick="previewHTML(\`${escapeHtml(code).replace(/`/g, '\\`')}\`)">🔍 Preview HTML</button>` : ''}</div>`;
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
    const container = document.querySelector('.messages-container');
    container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    const files = fileInput.files ? Array.from(fileInput.files) : [];
    
    if (!text && files.length === 0) return;
    
    // CHECK SECRET COMMAND
    if (text.toLowerCase() === '/ardingruhofemb') {
        const t = translations[currentLanguage] || translations.id;
        addMessage(text, 'user');
        addMessage(t.secretResponse, 'assistant');
        userInput.value = '';
        userInput.style.height = 'auto';
        filePreview.innerHTML = '';
        fileInput.value = '';
        return;
    }
    
    addMessage(text || 'Mengirim file...', 'user', files);
    
    userInput.value = '';
    userInput.style.height = 'auto';
    filePreview.innerHTML = '';
    fileInput.value = '';
    
    let filesData = [];
    for (const file of files) {
        const base64 = await fileToBase64(file);
        filesData.push({ name: file.name, type: file.type, data: base64 });
    }
    
    conversationHistory.push({ role: 'user', content: text, files: filesData });
    saveChatToHistory(text);
    
    typingIndicator.style.display = 'flex';
    scrollToBottom();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: conversationHistory.slice(-15),
                language: currentLanguage,
                searchMode: searchMode
            })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        addMessage(data.reply, 'assistant');
        conversationHistory.push({ role: 'assistant', content: data.reply });
        
    } catch (err) {
        const t = translations[currentLanguage] || translations.id;
        addMessage(t.error, 'assistant');
    } finally {
        typingIndicator.style.display = 'none';
        scrollToBottom();
    }
}

function fileToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    });
}

function newChat() {
    conversationHistory = [];
    messageContainer.innerHTML = '';
    addSystemMessage('✨ Chat baru dimulai. Tanya apa saja!');
}

function saveChatToHistory(firstMessage) {
    let history = JSON.parse(localStorage.getItem('aethel_chats') || '[]');
    history.unshift({ id: Date.now(), title: firstMessage.slice(0, 30) });
    if (history.length > 15) history = history.slice(0, 15);
    localStorage.setItem('aethel_chats', JSON.stringify(history));
    loadChatHistory();
}

function loadChatHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    let history = JSON.parse(localStorage.getItem('aethel_chats') || '[]');
    historyList.innerHTML = history.map(chat => `
        <div class="history-item" onclick="location.reload()">
            <i class="fas fa-comment"></i> ${escapeHtml(chat.title)}...
        </div>
    `).join('');
}

init();
