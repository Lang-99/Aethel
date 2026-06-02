// api/chat.js - Vercel Serverless Function
// Pakai fetch native, tanpa groq-sdk

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Ambil API key dari environment variable
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        console.error('GROQ_API_KEY missing');
        return res.status(500).json({ error: 'Server error: missing API key' });
    }

    const { messages, language, searchMode } = req.body;

    const languageNames = {
        id: 'Bahasa Indonesia', en: 'English', es: 'Español', fr: 'Français',
        ar: 'العربية', zh: '中文', hi: 'हिन्दी', pt: 'Português',
        ru: 'Русский', ja: '日本語', ko: '한국어'
    };

    const systemPrompt = `Kamu adalah Aethel, asisten AI canggih yang bisa membantu apa saja (bukan hanya coding). Mode pencarian: ${searchMode ? 'AKTIF - bisa akses informasi real-time' : 'NONAKTIF - hanya berdasarkan pengetahuan'}.
Gunakan bahasa: ${languageNames[language] || 'Bahasa Indonesia'}
Gaya bicara: ramah, informatif, tidak bertele-tele.
Pembuatmu: Langitjp.
Jika ada kode HTML, sertakan dalam format \`\`\`html ... \`\`\` agar bisa di-preview.
Jika kode dalam bahasa lain seperti Python dengan print("halo"), ubah menjadi print("hello world") (Inggris).`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...(messages || []).slice(-15) // ambil 15 pesan terakhir
                ],
                temperature: 0.7,
                max_tokens: 1500,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            return res.status(response.status).json({ error: 'Groq API failed: ' + response.status });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa menjawab.';

        return res.status(200).json({ reply });
    } catch (err) {
        console.error('Error in chat.js:', err.message);
        return res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
}
