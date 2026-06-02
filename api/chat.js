// api/chat.js
// Endpoint untuk memanggil Groq API (gratis)
// Pastikan di Vercel sudah ada environment variable GROQ_API_KEY

import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages' });
    }

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `Kamu adalah Aethel, asisten tutor coding yang ramah dan jelas. 
Bahasa Indonesia yang santai, tidak bertele-tele. 
Bantu user belajar HTML, CSS, JavaScript, React, Python, atau debugging. 
Berikan contoh kode jika diperlukan. Jawab dengan sopan dan informatif.`
                },
                ...messages
            ],
            temperature: 0.6,
            max_tokens: 800,
        });

        const reply = completion.choices[0].message.content;
        res.status(200).json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal memproses permintaan' });
    }
}
