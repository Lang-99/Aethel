// api/chat.js - Vercel Serverless Function (Clean)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, language, searchMode } = req.body;
    
    // Ambil pesan terakhir dari user
    const lastUserMessage = messages?.filter(m => m.role === 'user').pop()?.content || '';
    
    // SECRET COMMAND
    if (lastUserMessage.toLowerCase() === '/ardingruhofemb') {
        return res.status(200).json({ 
            reply: "ardifemboysxxxxxxxxxxx92"
        });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    // FALLBACK (tanpa API key atau error)
    const fallbackReply = (question) => {
        const q = question.toLowerCase();
        if (q.includes('siapa pembuat') || q.includes('dibuat oleh') || q.includes('buat siapa')) {
            return "Saya Aethel, dibuat oleh **Langitjp**. Ada yang bisa saya bantu? ✨";
        }
        if (q.includes('html') && (q.includes('buat') || q.includes('code') || q.includes('tulis'))) {
            return `Contoh kode HTML sederhana:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Halaman Saya</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>✨ Selamat datang!</h1>
    <p>Ini halaman HTML yang kamu minta.</p>
    <button onclick="alert('Halo!')">Klik Aku</button>
</body>
</html>
\`\`\`

Klik **Preview HTML** untuk melihat hasilnya.`;
        }
        if (q.includes('css')) {
            return `Contoh CSS modern:

\`\`\`css
.card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}
.card:hover {
    transform: translateY(-5px);
}
\`\`\``;
        }
        if (q.includes('javascript') || q.includes('js')) {
            return `Contoh JavaScript:

\`\`\`javascript
async function fetchData() {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
}
\`\`\``;
        }
        return `Halo! Aku Aethel, asisten AI kamu. 👋

Coba tanya:
• **Buat kode HTML** untuk website
• **CSS styling** untuk card
• **JavaScript** untuk fungsi
• **Siapa pembuatmu?**

Atau ketik **/ardingruhofemb** untuk secret command. ✨`;
    };

    // Jika tidak ada API key, pakai fallback
    if (!GROQ_API_KEY) {
        return res.status(200).json({ reply: fallbackReply(lastUserMessage) });
    }

    // Bahasa
    const languageNames = {
        id: 'Bahasa Indonesia', en: 'English', es: 'Español', fr: 'Français',
        ar: 'العربية', zh: '中文', hi: 'हिन्दी', pt: 'Português',
        ru: 'Русский', ja: '日本語', ko: '한국어', de: 'Deutsch',
        it: 'Italiano', tr: 'Türkçe', vi: 'Tiếng Việt', th: 'ไทย',
        pl: 'Polski', nl: 'Nederlands', sv: 'Svenska', ms: 'Melayu'
    };

    const systemPrompt = `Kamu adalah Aethel, asisten AI canggih. Mode pencarian: ${searchMode ? 'AKTIF' : 'NONAKTIF'}.
Gunakan bahasa: ${languageNames[language] || 'Bahasa Indonesia'}
Gaya bicara: ramah, informatif, tidak bertele-tele.
Pembuatmu: Langitjp.
Jika ada kode HTML, sertakan dalam format \`\`\`html ... \`\`\` agar bisa di-preview.`;

    try {
        // Bersihkan messages: hanya ambil role dan content
        const cleanMessages = messages?.slice(-15).map(m => ({
            role: m.role,
            content: m.content
        })) || [];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...cleanMessages
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            return res.status(200).json({ reply: fallbackReply(lastUserMessage) });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || fallbackReply(lastUserMessage);
        return res.status(200).json({ reply });
        
    } catch (err) {
        console.error('Error in chat.js:', err.message);
        return res.status(200).json({ reply: fallbackReply(lastUserMessage) });
    }
}
