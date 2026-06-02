// Aethel v3.0 - Full Version

console.log('Aethel v3.0 loaded');

let searchMode = localStorage.getItem('aethel_search_mode') === 'true';
let currentLanguage = localStorage.getItem('aethel_language') || 'id';
let conversationHistory = [];
let currentChatId = localStorage.getItem('aethel_current_chat') || 'chat_' + Date.now();

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

document.addEventListener('DOMContentLoaded', function() {
    init();
    loadChatList();
    loadChat(currentChatId);
});

function init() {
    const elements = {
        newChatBtn: document.getElementById('newChatBtn'),
        settingsBtn: document.getElementById('settingsBtn'),
        settingsHeaderBtn: document.getElementById('settingsHeaderBtn'),
        closeSettingsModal: document.getElementById('closeSettingsModal'),
        closePreviewModal: document.getElementById('closePreviewModal'),
        sidebarToggle: document.getElementById('sidebarToggle'),
        sendBtn: document.getElementById('sendBtn'),
        userInput: document.getElementById('userInput'),
        attachBtn: document.getElementById('attachBtn'),
        fileInput: document.getElementById('fileInput'),
        searchModeBtn: document.getElementById('searchModeBtn'),
        searchModeToggle: document.getElementById('searchModeToggle'),
        languageSelect: document.getElementById('languageSelect'),
        settingsModal: document.getElementById('settingsModal'),
        previewModal: document.getElementById('previewModal'),
        exportHistoryBtn: document.getElementById('exportHistoryBtn'),
        clearAllHistoryBtn: document.getElementById('clearAllHistoryBtn')
    };
    
    if (elements.newChatBtn) elements.newChatBtn.onclick = () => newChat();
    if (elements.settingsBtn) elements.settingsBtn.onclick = () => elements.settingsModal.style.display = 'flex';
    if (elements.settingsHeaderBtn) elements.settingsHeaderBtn.onclick = () => elements.settingsModal.style.display = 'flex';
    if (elements.closeSettingsModal) elements.closeSettingsModal.onclick = () => elements.settingsModal.style.display = 'none';
    if (elements.closePreviewModal) elements.closePreviewModal.onclick = () => elements.previewModal.style.display = 'none';
    if (elements.sidebarToggle && document.getElementById('sidebar')) elements.sidebarToggle.onclick = () => document.getElementById('sidebar').classList.toggle('open');
    if (elements.sendBtn) elements.sendBtn.onclick = () => sendMessage();
    if (elements.userInput) elements.userInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
    if (elements.attachBtn && elements.fileInput) {
        elements.attachBtn.onclick = () => elements.fileInput.click();
        elements.fileInput.onchange = (e) => handleFileSelect(e);
    }
    if (elements.searchModeBtn) elements.searchModeBtn.onclick = () => toggleSearchMode();
    if (elements.searchModeToggle) {
        elements.searchModeToggle.checked = searchMode;
        elements.searchModeToggle.onchange = (e) => { searchMode = e.target.checked; localStorage.setItem('aethel_search_mode', searchMode); updateSearchModeUI(); addSystemMessage(searchMode ? 'Mode pencarian aktif' : 'Mode pencarian nonaktif'); };
    }
    if (elements.languageSelect) {
        elements.languageSelect.value = currentLanguage;
        elements.languageSelect.onchange = (e) => { currentLanguage = e.target.value; localStorage.setItem('aethel_language', currentLanguage); updateSearchModeUI(); updateTypingText(); };
    }
    if (elements.exportHistoryBtn) elements.exportHistoryBtn.onclick = () => exportAllChats();
    if (elements.clearAllHistoryBtn) elements.clearAllHistoryBtn.onclick = () => { if(confirm('Hapus SEMUA riwayat chat?')) clearAllHistory(); };
    
    window.onclick = (e) => {
        if (elements.settingsModal && e.target === elements.settingsModal) elements.settingsModal.style.display = 'none';
        if (elements.previewModal && e.target === elements.previewModal) elements.previewModal.style.display = 'none';
    };
    
    updateSearchModeUI();
    updateTypingText();
}

function updateTypingText() {
    const t = translations[currentLanguage] || translations.id;
    const typingText = document.getElementById('typingText');
    if (typingText) typingText.textContent = t.typing;
}

function toggleSearchMode() {
    searchMode = !searchMode;
    localStorage.setItem('aethel_search_mode', searchMode);
    const toggle = document.getElementById('searchModeToggle');
    if (toggle) toggle.checked = searchMode;
    updateSearchModeUI();
    addSystemMessage(searchMode ? 'Mode pencarian aktif' : 'Mode pencarian nonaktif');
}

function updateSearchModeUI() {
    const textSpan = document.getElementById('searchModeText');
    const btn = document.getElementById('searchModeBtn');
    const t = translations[currentLanguage] || translations.id;
    if (textSpan) textSpan.textContent = searchMode ? t.searchOn : t.searchOff;
    if (btn) btn.classList.toggle('active', searchMode);
}

function addSystemMessage(text) {
    const container = document.getElementById('messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.innerHTML = `<div class="avatar"><i class="fas fa-info-circle"></i></div><div class="message-content" style="background:none;font-style:italic;font-size:12px;">${escapeHtml(text)}</div>`;
    container.appendChild(div);
    scrollToBottom();
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('filePreview');
    if (!preview) return;
    preview.innerHTML = '';
    files.forEach(file => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.cssText = 'width:24px;height:24px;border-radius:4px';
            item.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.className = 'fas fa-file';
            item.appendChild(icon);
        }
        const span = document.createElement('span');
        span.textContent = file.name.length > 20 ? file.name.slice(0,17)+'...' : file.name;
        item.appendChild(span);
        const remove = document.createElement('button');
        remove.innerHTML = '&times;';
        remove.style.cssText = 'background:none;border:none;cursor:pointer;margin-left:4px';
        remove.onclick = () => item.remove();
        item.appendChild(remove);
        preview.appendChild(item);
    });
}

function addMessage(content, role, files = []) {
    const container = document.getElementById('messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `message ${role}`;
    let html = '';
    if (role === 'assistant') html = `<div class="avatar"><i class="fas fa-robot"></i></div>`;
    html += `<div class="message-content">`;
    if (files.length) {
        files.forEach(f => {
            if (f.type?.startsWith('image/')) html += `<img src="${URL.createObjectURL(f)}" class="message-image">`;
            else html += `<div class="file-attachment"><i class="fas fa-paperclip"></i> ${escapeHtml(f.name)}</div>`;
        });
    }
    let processed = escapeHtml(content);
    processed = processed.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const isHtml = lang === 'html' || lang === 'HTML';
        return `<div class="code-block"><code>${escapeHtml(code)}</code>${isHtml ? `<button class="preview-btn" onclick="previewHTML(\`${escapeHtml(code).replace(/`/g, '\\`')}\`)">Preview HTML</button>` : ''}</div>`;
    });
    html += processed + `</div>`;
    div.innerHTML = html;
    container.appendChild(div);
    scrollToBottom();
}

window.previewHTML = (html) => {
    const frame = document.getElementById('previewFrame');
    const modal = document.getElementById('previewModal');
    if (frame) frame.innerHTML = html;
    if (modal) modal.style.display = 'flex';
};

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    const container = document.getElementById('messagesContainer');
    if (container) container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('filePreview');
    const typing = document.getElementById('typingIndicator');
    if (!input) return;
    const text = input.value.trim();
    const files = fileInput ? Array.from(fileInput.files) : [];
    if (!text && !files.length) return;
    
    if (text.toLowerCase() === '/ardingruhofemb') {
        const t = translations[currentLanguage] || translations.id;
        addMessage(text, 'user');
        addMessage(t.secretResponse, 'assistant');
        input.value = '';
        if (fileInput) fileInput.value = '';
        if (preview) preview.innerHTML = '';
        return;
    }
    
    addMessage(text || 'Mengirim file...', 'user', files);
    input.value = '';
    input.style.height = 'auto';
    if (preview) preview.innerHTML = '';
    if (fileInput) fileInput.value = '';
    
    conversationHistory.push({ role: 'user', content: text });
    saveCurrentChat();
    if (typing) typing.style.display = 'flex';
    scrollToBottom();
    
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversationHistory.slice(-15).map(m => ({ role: m.role, content: m.content })), language: currentLanguage, searchMode: searchMode })
        });
        const data = await res.json();
        addMessage(data.reply, 'assistant');
        conversationHistory.push({ role: 'assistant', content: data.reply });
        saveCurrentChat();
    } catch(err) {
        const t = translations[currentLanguage] || translations.id;
        addMessage(t.error, 'assistant');
    } finally {
        if (typing) typing.style.display = 'none';
        scrollToBottom();
    }
}

function saveCurrentChat() {
    const chats = JSON.parse(localStorage.getItem('aethel_all_chats') || '{}');
    chats[currentChatId] = { id: currentChatId, title: conversationHistory[0]?.content?.slice(0,30) || 'Chat baru', messages: conversationHistory, updatedAt: Date.now() };
    localStorage.setItem('aethel_all_chats', JSON.stringify(chats));
    loadChatList();
}

function loadChatList() {
    const listDiv = document.getElementById('historyList');
    if (!listDiv) return;
    const chats = JSON.parse(localStorage.getItem('aethel_all_chats') || '{}');
    const sorted = Object.values(chats).sort((a,b) => (b.updatedAt||0) - (a.updatedAt||0));
    listDiv.innerHTML = sorted.map(chat => `
        <div class="history-item" data-id="${chat.id}">
            <span class="history-title" onclick="loadChat('${chat.id}')">${escapeHtml(chat.title)}</span>
            <button class="delete-history-btn" onclick="deleteChat('${chat.id}')"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function loadChat(chatId) {
    const chats = JSON.parse(localStorage.getItem('aethel_all_chats') || '{}');
    const chat = chats[chatId];
    if (!chat) return;
    currentChatId = chatId;
    localStorage.setItem('aethel_current_chat', chatId);
    conversationHistory = chat.messages || [];
    const container = document.getElementById('messages');
    if (container) {
        container.innerHTML = '';
        conversationHistory.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.role}`;
            div.innerHTML = msg.role === 'assistant' ? `<div class="avatar"><i class="fas fa-robot"></i></div><div class="message-content">${escapeHtml(msg.content)}</div>` : `<div class="message-content">${escapeHtml(msg.content)}</div>`;
            container.appendChild(div);
        });
    }
    scrollToBottom();
}

function deleteChat(chatId) {
    const chats = JSON.parse(localStorage.getItem('aethel_all_chats') || '{}');
    delete chats[chatId];
    localStorage.setItem('aethel_all_chats', JSON.stringify(chats));
    if (currentChatId === chatId) newChat();
    loadChatList();
}

function clearAllHistory() {
    localStorage.removeItem('aethel_all_chats');
    newChat();
    loadChatList();
}

function exportAllChats() {
    const chats = localStorage.getItem('aethel_all_chats');
    const dataStr = JSON.stringify(JSON.parse(chats || '{}'), null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aethel_chats_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function newChat() {
    currentChatId = 'chat_' + Date.now();
    localStorage.setItem('aethel_current_chat', currentChatId);
    conversationHistory = [];
    const container = document.getElementById('messages');
    if (container) container.innerHTML = '';
    addSystemMessage('Chat baru dimulai!');
}
