// Aethel frontend – memanggil API sendiri di Vercel

const messageContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typing');

let conversationHistory = [];

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
            body: JSON.stringify({ messages: conversationHistory })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const aiReply = data.reply;
        addMessage(aiReply, 'assistant');
        conversationHistory.push({ role: 'assistant', content: aiReply });

        // simpan max 20 pesan
        if (conversationHistory.length > 20) conversationHistory = conversationHistory.slice(-20);
    } catch (err) {
        addMessage(`❌ Gagal: ${err.message}. Cek koneksi atau API key.`, 'assistant');
    } finally {
        typingIndicator.style.display = 'none';
        scrollToBottom();
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Contoh chips
document.querySelectorAll('.example-chip').forEach(btn => {
    btn.addEventListener('click', () => {
        userInput.value = btn.innerText;
        sendMessage();
    });
});
