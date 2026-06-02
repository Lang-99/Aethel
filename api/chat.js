export default async function handler(req, res) {
    // Hanya menerima POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Ambil API key dari environment variable Vercel
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        console.error('GROQ_API_KEY tidak diset di environment');
        return res.status(500).json({ error: 'Server error: missing API key' });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Format request salah' });
    }

    try {
        // Panggil langsung API Groq (tanpa SDK)
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `Kamu adalah Aethel, asisten tutor coding yang ramah dan jelas. Gunakan bahasa Indonesia santai. Bantu user belajar HTML, CSS, JavaScript, React, Python, atau debugging. Beri contoh kode jika perlu.`
                    },
                    ...messages
                ],
                temperature: 0.6,
                max_tokens: 800,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Groq API error: ${response.status}`, errorBody);
            return res.status(response.status).json({ error: 'Gagal dari Groq API' });
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;
        return res.status(200).json({ reply });
    } catch (err) {
        console.error('Error di serverless function:', err);
        return res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
}
