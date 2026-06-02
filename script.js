// Aethel v3.0 - Full Featured AI Tutor

// DOM Elements
const messageContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typing');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const termsModal = document.getElementById('termsModal');
const closeModal = document.querySelector('.close-modal');
const closeTerms = document.querySelector('.close-terms');
const searchModeToggle = document.getElementById('searchModeToggle');
const languageSelect = document.getElementById('languageSelect');
const termsBtn = document.getElementById('termsBtn');

// State
let conversationHistory = [];
let searchMode = localStorage.getItem('aethel_search_mode') === 'true';
let currentLanguage = localStorage.getItem('aethel_language') || 'id';
let currentTheme = localStorage.getItem('aethel_theme') || 'dark';

// Translations (20 languages)
const translations = {
    id: { greeting: "✦ Halo! Aku Aethel, AI tutor canggihmu. Ada yang ingin kamu pelajari tentang coding hari ini?", creator: "Saya dibuat oleh Langitjp", typing: "Aethel sedang mengetik..." },
    en: { greeting: "✦ Hi! I'm Aethel, your advanced AI tutor. What would you like to learn about coding today?", creator: "I was created by Langitjp", typing: "Aethel is typing..." },
    ar: { greeting: "✦ مرحبًا! أنا إيثيل، معلمك الذكي. ماذا تريد أن تتعلم عن البرمجة اليوم؟", creator: "لقد تم إنشائي بواسطة لانجيت جي بي", typing: "إيثيل يكتب..." },
    zh: { greeting: "✦ 你好！我是Aethel，你的智能AI导师。今天想学习什么编程知识？", creator: "我由Langitjp创建", typing: "Aethel正在输入..." },
    es: { greeting: "✦ ¡Hola! Soy Aethel, tu tutor avanzado de IA. ¿Qué quieres aprender sobre programación hoy?", creator: "Fui creado por Langitjp", typing: "Aethel está escribiendo..." },
    fr: { greeting: "✦ Bonjour ! Je suis Aethel, ton tuteur IA avancé. Qu'aimerais-tu apprendre en programmation aujourd'hui ?", creator: "J'ai été créé par Langitjp", typing: "Aethel écrit..." },
    hi: { greeting: "✦ नमस्ते! मैं एथेल हूं, आपका उन्नत AI ट्यूटर। आज कोडिंग के बारे में क्या सीखना चाहेंगे?", creator: "मुझे लैंगिटजेपी ने बनाया है", typing: "एथेल टाइप कर रहा है..." },
    pt: { greeting: "✦ Olá! Sou Aethel, seu tutor de IA avançado. O que você gostaria de aprender sobre programação hoje?", creator: "Fui criado por Langitjp", typing: "Aethel está digitando..." },
    ru: { greeting: "✦ Привет! Я Этель, твой продвинутый AI-репетитор. Что ты хочешь узнать о программировании сегодня?", creator: "Я был создан Langitjp", typing: "Этель печатает..." },
    ja: { greeting: "✦ こんにちは！私はAethel、あなたの先進的なAIチューターです。今日はコーディングについて何を学びたいですか？", creator: "私はLangitjpによって作成されました", typing: "Aethelが入力中..." },
    ko: { greeting: "✦ 안녕하세요! 저는 Aethel, 당신의 고급 AI 튜터입니다. 오늘 코딩에 대해 무엇을 배우고 싶으신가요?", creator: "저는 Langitjp에 의해 만들어졌습니다", typing: "Aethel이 입력 중..." },
    de: { greeting: "✦ Hallo! Ich bin Aethel, dein fortschrittlicher AI-Tutor. Was möchtest du heute über das Programmieren lernen?", creator: "Ich wurde von Langitjp erstellt", typing: "Aethel tippt..." },
    it: { greeting: "✦ Ciao! Sono Aethel, il tuo tutor AI avanzato. Cosa vorresti imparare sulla programmazione oggi?", creator: "Sono stato creato da Langitjp", typing: "Aethel sta scrivendo..." },
    tr: { greeting: "✦ Merhaba! Ben Aethel, gelişmiş yapay zeka öğretmenin. Bugün kodlama hakkında ne öğrenmek istersin?", creator: "Langitjp tarafından yaratıldım", typing: "Aethel yazıyor..." },
    vi: { greeting: "✦ Xin chào! Tôi là Aethel, gia sư AI nâng cao của bạn. Hôm nay bạn muốn học gì về lập trình?", creator: "Tôi được tạo bởi Langitjp", typing: "Aethel đang gõ..." },
    th: { greeting: "✦ สวัสดี! ฉันคือ Aethel ผู้สอน AI ขั้นสูงของคุณ วันนี้คุณอยากเรียนรู้อะไรเกี่ยวกับการเขียนโค้ดบ้าง?", creator: "ฉันถูกสร้างโดย Langitjp", typing: "Aethel กำลังพิมพ์..." },
    pl: { greeting: "✦ Cześć! Jestem Aethel, twój zaawansowany nauczyciel AI. Czego chciałbyś się dzisiaj nauczyć o kodowaniu?", creator: "Zostałem stworzony przez Langitjp", typing: "Aethel pisze..." },
    nl: { greeting: "✦ Hallo! Ik ben Aethel, jouw geavanceerde AI-tutor. Wat wil je vandaag leren over coderen?", creator: "Ik ben gemaakt door Langitjp", typing: "Aethel typt..." },
    sv: { greeting: "✦ Hej! Jag är Aethel, din avancerade AI-handledare. Vad vill du lära dig om kodning idag?", creator: "Jag skapades av Langitjp", typing: "Aethel skriver..." },
    no: { greeting: "✦ Hei! Jeg er Aethel, din avanserte AI-veileder. Hva vil du lære om koding i dag?", creator: "Jeg ble laget av Langitjp", typing: "Aethel skriver..." }
};

// Initialize
function init() {
    // Load saved settings
    searchModeToggle.checked = searchMode;
    languageSelect.value = currentLanguage;
    
    // Apply theme
    applyTheme(currentTheme);
    
    // Update greeting with current language
    const greeting = translations[currentLanguage]?.greeting || translations.id.greeting;
    document.querySelector('.message.assistant .content').innerHTML = greeting;
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
    closeModal.addEventListener('click', () => settingsModal.style.display = 'none');
    closeTerms.addEventListener('click', () => termsModal.style.display = 'none');
    termsBtn.addEventListener('click', () => termsModal.style.display = 'flex');
    
    searchModeToggle.addEventListener('change', (e) => {
        searchMode = e.target.checked;
        localStorage.setItem('aethel_search_mode', searchMode);
    });
    
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('aethel_language', currentLanguage);
        updateLanguage();
    });
    
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
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.style.display = 'none';
        if (e.target === termsModal) termsModal.style.display = 'none';
    });
    
    // Auto resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
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

function updateLanguage() {
    const greeting = translations[currentLanguage]?.greeting || translations.id.greeting;
    const firstMsg = document.querySelector('.message.assistant .content');
    if (firstMsg && firstMsg.innerHTML.includes('Halo') || firstMsg.innerHTML.includes('Hi')) {
        firstMsg.innerHTML = greeting;
    }
    typingIndicator.textContent = translations[currentLanguage]?.typing || translations.id.typing;
}

function addMessage(content, role) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.innerHTML = `
        <div class="avatar">${role === 'user' ? 'U' : 'A'}</div>
        <div class="content">${escapeHtml(content)}</div>
    `;
    messageContainer.appendChild(msgDiv);
    scrollToBottom();
}

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
    if (!text) return;
    
    // Check if asking about creator
    const lowerText = text.toLowerCase();
    if (lowerText.includes('siapa pembuat') || lowerText.includes('creator') || lowerText.includes('dibuat oleh') || lowerText.includes('buat siapa') || lowerText.includes('who made you')) {
        const creatorReply = translations[currentLanguage]?.creator || "Saya dibuat oleh Langitjp";
        addMessage(creatorReply, 'assistant');
        userInput.value = '';
        userInput.style.height = 'auto';
        return;
    }
    
    addMessage(text, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';
    
    conversationHistory.push({ role: 'user', content: text });
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
        addMessage(`❌ Gagal: ${err.message}. Coba lagi nanti.`, 'assistant');
    } finally {
        typingIndicator.style.display = 'none';
        scrollToBottom();
    }
}

// Start the app
init();
