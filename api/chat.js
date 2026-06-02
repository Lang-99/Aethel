// api/chat.js - Vercel Serverless Function
export default async function handler(req, res) {
    // CORS
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
    
    // Jika API key tidak ada, kirim pesan error tapi tetap balas (agar tidak error di frontend)
    if (!GROQ_API_KEY) {
        console.error('GROQ_API_KEY missing');
        return res.status(200).json({ 
            reply: "⚠️ API key belum diset. Silakan tambahkan GROQ_API_KEY di environment variable Vercel.\n\nCara: Settings → Environment Variables → tambah GROQ_API_KEY dengan nilai dari console.groq.com"
        });
    }

    const { messages, language, searchMode } = req.body;

    const languageNames = {
        id: 'Bahasa Indonesia', en: 'English', es: 'Español', fr: 'Français',
        ar: 'العربية', zh: '中文', hi: 'हिन्दी', pt: 'Português',
        ru: 'Русский', ja: '日本語', ko: '한국어'
    };

    const systemPrompt = `Kamu adalah Aethel, asisten AI canggih yang bisa membantu apa saja. Mode pencarian: ${searchMode ? 'AKTIF' : 'NONAKTIF'}.
Gunakan bahasa: ${languageNames[language] || 'Bahasa Indonesia'}
Gaya bicara: ramah, informatif, tidak bertele-tele.
Pembuatmu: Langitjp.
Jika ada kode HTML, sertakan dalam format \`\`\`html ... \`\`\` agar bisa di-preview.`;

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
                    ...(messages || []).slice(-15)
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            return res.status(200).json({ 
                reply: `⚠️ Error dari Groq API (${response.status}). Cek API key di Vercel.`
            });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa menjawab.';
        return res.status(200).json({ reply });
        
    } catch (err) {
        console.error('Error in chat.js:', err.message);
        return res.status(200).json({ 
            reply: `⚠️ Error server: ${err.message}. Periksa API key di Vercel.`
        });
    }
}
