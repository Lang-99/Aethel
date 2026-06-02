export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        return res.status(500).json({ error: 'Server error: missing API key' });
    }
    
    const { messages, language, searchMode } = req.body;
    
    const languageNames = {
        id: 'Bahasa Indonesia', en: 'English', ar: 'العربية', zh: '中文', es: 'Español',
        fr: 'Français', hi: 'हिन्दी', pt: 'Português', ru: 'Русский', ja: '日本語',
        ko: '한국어', de: 'Deutsch', it: 'Italiano', tr: 'Türkçe', vi: 'Tiếng Việt',
        th: 'ไทย', pl: 'Polski', nl: 'Nederlands', sv: 'Svenska', no: 'Norsk'
    };
    
    const systemPrompt = `Kamu adalah Aethel, AI tutor coding canggih. Fitur:
- Berbicara dalam bahasa: ${languageNames[language] || 'Bahasa Indonesia'}
- Mode pencarian: ${searchMode ? 'AKTIF (bisa akses info real-time)' : 'NONAKTIF (hanya berdasarkan pengetahuan)'}
- Gaya bicara ramah, informatif, tidak bertele-tele
- Berikan contoh kode jika diminta
- Bantu belajar: HTML, CSS, JS, React, Python, Java, PHP, dll
- Jika mode pencarian aktif, beri informasi terupdate
    
Pembuatmu adalah Langitjp.
Jika ditanya siapa pembuatmu, jawab dengan bangga: "Saya dibuat oleh Langitjp" dalam bahasa yang sesuai.`;
    
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
                    ...(messages || [])
                ],
                temperature: 0.6,
                max_tokens: 1000,
            }),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            return res.status(response.status).json({ error: 'Groq API failed' });
        }
        
        const data = await response.json();
        const reply = data.choices[0].message.content;
        return res.status(200).json({ reply });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
