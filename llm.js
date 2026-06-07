// llm.js — loaded before content.js, exposes runChain() globally

const SYSTEM_PROMPT = `You explain text in simple, clear language. The user has selected a portion of text marked with [[[...]]]. Use surrounding context to understand it better. Explain in 3-4 concise lines. No bullet points. No markdown. Just plain easy-to-read English.`;

const PROVIDERS = {

    openai: {
        async invoke(cfg, userPrompt) {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfg.apiKey}`
                },
                body: JSON.stringify({
                    model: cfg.model || "gpt-4o-mini",
                    max_tokens: 200,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userPrompt }
                    ]
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices[0].message.content;
        }
    },

    anthropic: {
        async invoke(cfg, userPrompt) {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": cfg.apiKey,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true"
                },
                body: JSON.stringify({
                    model: cfg.model || "claude-haiku-4-5-20251001",
                    max_tokens: 200,
                    system: SYSTEM_PROMPT,
                    messages: [{ role: "user", content: userPrompt }]
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.content[0].text;
        }
    },

    gemini: {
        async invoke(cfg, userPrompt) {
            const model = cfg.model || "gemini-2.0-flash";
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cfg.apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                        contents: [{ parts: [{ text: userPrompt }] }],
                        generationConfig: { maxOutputTokens: 200, temperature: 0.4 }
                    })
                }
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.candidates[0].content.parts[0].text;
        }
    },

    groq: {
        async invoke(cfg, userPrompt) {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfg.apiKey}`
                },
                body: JSON.stringify({
                    model: cfg.model || "llama-3.1-8b-instant",
                    max_tokens: 200,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userPrompt }
                    ]
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices[0].message.content;
        }
    },

    mistral: {
        async invoke(cfg, userPrompt) {
            const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfg.apiKey}`
                },
                body: JSON.stringify({
                    model: cfg.model || "mistral-small-latest",
                    max_tokens: 200,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userPrompt }
                    ]
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices[0].message.content;
        }
    },

    together: {
        async invoke(cfg, userPrompt) {
            const res = await fetch("https://api.together.xyz/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfg.apiKey}`
                },
                body: JSON.stringify({
                    model: cfg.model || "meta-llama/Llama-3.2-3B-Instruct-Turbo",
                    max_tokens: 200,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userPrompt }
                    ]
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices[0].message.content;
        }
    },

    huggingface: {
        async invoke(cfg, userPrompt) {
            const model = cfg.model || "mistralai/Mistral-7B-Instruct-v0.3";
            const res = await fetch(
                `https://router.huggingface.co/hf-inference/models/${model}/v1/chat/completions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${cfg.apiKey}`
                    },
                    body: JSON.stringify({
                        model,
                        max_tokens: 200,
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            { role: "user", content: userPrompt }
                        ]
                    })
                }
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
            return data.choices[0].message.content;
        }
    },

    ollama: {
        async invoke(cfg, userPrompt) {
            const base = (cfg.baseUrl || "http://localhost:11434").replace(/\/$/, "");
            const res = await fetch(`${base}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: cfg.model || "llama3.2",
                    stream: false,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userPrompt }
                    ]
                })
            });
            const data = await res.json();
            return data.message.content;
        }
    },

    custom: {
        async invoke(cfg, userPrompt) {
            const res = await fetch(cfg.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(cfg.apiKey ? { "Authorization": `Bearer ${cfg.apiKey}` } : {})
                },
                body: JSON.stringify({
                    model: cfg.model || "default",
                    max_tokens: 200,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userPrompt }
                    ]
                })
            });
            const data = await res.json();
            return (
                data.choices?.[0]?.message?.content ||
                data.content?.[0]?.text ||
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                data.response || data.text || data.output
            );
        }
    }
};

// Global function called by content.js
async function runChain(cfg, userPrompt) {
    const provider = PROVIDERS[cfg.provider];
    if (!provider) throw new Error(`Unknown provider: ${cfg.provider}`);
    return await provider.invoke(cfg, userPrompt);
}