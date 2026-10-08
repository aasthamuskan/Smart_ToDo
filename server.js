require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/suggest', async (req, res) => {
    const { goal } = req.body;

    if (!goal || goal.trim().length < 3)
        return res.status(400).json({ error: 'Goal too short.' });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey)
        return res.status(500).json({ error: 'GROQ_API_KEY not set.' });

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant. When given a goal, return ONLY a JSON array of 3-5 short todo strings. No explanation, no markdown, just the array.'
                    },
                    {
                        role: 'user',
                        content: `Goal: "${goal.trim()}"\n\nReturn ONLY a JSON array like: ["task 1", "task 2", "task 3"]`
                    }
                ],
                temperature: 0.7,
                max_tokens: 512,
            })
        });

        const data = await response.json();

        if (!response.ok)
            return res.status(502).json({ error: data?.error?.message || 'API error' });

        let raw = data?.choices?.[0]?.message?.content || '';
        // clean up think tags or markdown
        raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/```[\s\S]*?```/g, '').trim();

        const match = raw.match(/\[[\s\S]*\]/);
        if (!match) return res.status(500).json({ error: 'Could not parse AI response.' });

        const tasks = JSON.parse(match[0]);
        res.json({ tasks });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

app.get('/{*splat}', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.listen(PORT, () => {
    console.log(`\n  Todo App  ->  http://localhost:${PORT}`);
    console.log(`  Groq API  ->  ${process.env.GROQ_API_KEY ? 'Key loaded' : 'KEY MISSING'}\n`);
});
