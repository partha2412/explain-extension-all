// llm.js — loaded before content.js, exposes runChain() globally

function buildPrompt(payload, mode, max_sentence, max_words) {    
    if (mode === "mcq")
        return `Question:\n${payload.text}`;
    if (mode === "qa")
        return `Question:\n${payload.text}\n\nContext:\n${payload.context || ""}`;
    if (mode === "summary")
        return `Text:\n${payload.text}\n\nContext:\n${payload.context || ""}`
    return `Text:\n${payload.text}\n\nContext:\n${payload.context || ""}\n\nExplain directly.\nMaximum ${max_sentence} sentence.${parseInt(max_sentence) < 2 ? "\nMaximum 12 words." : "\nMaximum " + max_words + " words."}`;
}
const NORMAL_SYSTEM_PROMPT = `
    Explain the selected text using context.
    Keep it concise.
    No markdown.
    `;

const TECHNICAL_PROMPT = `
You explain technical concepts accurately and professionally.

Rules:
- Use proper technical terminology.
- Be concise.
- Focus on the selected text.
- Use surrounding context when needed.
- No introductions.
- No bullet points.
- No markdown.
- Return only the explanation.
`;

const DEBUG_CODE = `
You are a code debugger, check the provided code vary carefully and tell me is the code is ok or not.
If code have some issue then correct code and reply minimum words.
If code is correct then Explain the code in easy & minimal steps.
And mention the time & space complexity if possible.
Each line contain 44 character, make points on these lines
`;
const SUMMARY_PROMPT = `
You summarize information clearly and briefly.

Rules:
- Focus on the main idea.
- Ignore minor details.
- Use surrounding context when needed.
- Keep the answer very short.
- No introductions.
- No bullet points.
- No markdown.
- Return only the summary.
`;

const ELI5_PROMPT = `
You explain concepts as if teaching a 10-year-old child.

Rules:
- Use very simple words.
- Avoid jargon.
- Use surrounding context when needed.
- Keep the explanation short.
- No introductions.
- No bullet points.
- No markdown.
- Return only the explanation.
`;

const MCQ_SYSTEM_PROMPT = `
You are an expert exam solver with deep knowledge across all subjects.

Steps you MUST follow:
1. Read the question carefully.
2. Eliminate obviously wrong options first.
3. From remaining options, pick the most accurate one.
4. Return ONLY the correct option exactly as written.

No explanation. No reasoning in output. Final answer only.
`;

const QA_SYSTEM_PROMPT = `
You are an accurate exam question-answering system.

Rules:
- Read the entire question carefully before answering.
- If multiple-choice options are provided, compare all options and select the correct one.
- Return ONLY the complete text of the correct option exactly as written.
- Do NOT return the option letter or number unless it is part of the option text.
- If no options are provided, return ONLY the direct answer.
- Do not explain your answer.
- Do not provide reasoning or justification.
- Do not repeat the question.
- Do not add "Answer:", "The correct answer is", or any other prefix.
- Do not use markdown.
- Do not add quotation marks.
- Do not add extra text.
- Return exactly ONE final answer.

Output ONLY the final answer.
`;

const MODES = {

    eli5: {
        temperature: 0.4,
        systemPrompt: ELI5_PROMPT
    },

    normal: {
        temperature: 0.4,
        systemPrompt: NORMAL_SYSTEM_PROMPT
    },

    technical: {
        temperature: 0.2,
        systemPrompt: TECHNICAL_PROMPT
    },

    debug_code: {
        temperature: 0.7,
        systemPrompt: DEBUG_CODE
    },

    summary: {
        temperature: 0.3,
        systemPrompt: SUMMARY_PROMPT
    },

    mcq: {
        temperature: 0,
        systemPrompt: MCQ_SYSTEM_PROMPT
    },
    qa: {
        temperature: 0,
        top_p: 0.1,
        systemPrompt: QA_SYSTEM_PROMPT
    }
};

function getMode(requestConfig) {
    return MODES[requestConfig?.mode] || MODES.normal;
}

const PROVIDERS = {

    openai: {
        async invoke(cfg, payload, requestConfig) {
            const mode = getMode(requestConfig);
            const userPrompt = buildPrompt(
                payload,
                requestConfig?.mode,
                cfg.max_sentences,
                cfg.max_words,
            );
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfg.apiKey}`
                },
                body: JSON.stringify({
                    model: cfg.model || "gpt-4o-mini",
                    max_tokens: cfg.maxTokens || 200,
                    temperature: mode.temperature,
                    messages: [
                        {
                            role: "system",
                            content: mode.systemPrompt
                        },
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
        async invoke(cfg, payload, requestConfig) {
            const mode = getMode(requestConfig);
            const userPrompt = buildPrompt(
                payload,
                requestConfig?.mode,
                cfg.max_sentences,
                cfg.max_words,
            );
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
                    max_tokens: cfg.maxTokens || 200,
                    system: mode.systemPrompt,
                    messages: [{ role: "user", content: userPrompt }]
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.content[0].text;
        }
    },

    gemini: {
        async invoke(cfg, payload, requestConfig) {
            const mode = getMode(requestConfig);
            const userPrompt = buildPrompt(
                payload,
                requestConfig?.mode,
                cfg.max_sentences,
                cfg.max_words,
            );
            // console.log(mode);
            
            const model = cfg.model || "gemini-3.1-flash-lite-preview";
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cfg.apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: mode.systemPrompt }] },
                        contents: [{ parts: [{ text: userPrompt }] }],
                        generationConfig: {
                            maxOutputTokens: cfg.maxTokens || 200,
                            temperature: mode.temperature
                        }
                    })
                }
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.candidates[0].content.parts[0].text;
        }
    },

    groq: {
        async invoke(cfg, payload, requestConfig) {
            const mode = getMode(requestConfig);
            const userPrompt = buildPrompt(
                payload,
                requestConfig?.mode,
                cfg.max_sentences,
                cfg.max_words,
            );
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfg.apiKey}`
                },
                body: JSON.stringify({
                    model: cfg.model || "llama-3.3-70b-versatile",
                    temperature: mode.temperature,
                    max_tokens: cfg.maxTokens || 200,
                    messages: [
                        {
                            role: "system",
                            content: mode.systemPrompt
                        },
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
        async invoke(cfg, payload, requestConfig) {
            const mode = getMode(requestConfig);
            const userPrompt = buildPrompt(
                payload,
                requestConfig?.mode,
                cfg.max_sentences,
                cfg.max_words,
            );
            const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfg.apiKey}`
                },
                body: JSON.stringify({
                    model: cfg.model || "mistral-small-latest",
                    temperature: mode.temperature,
                    max_tokens: cfg.maxTokens || 200,
                    messages: [
                        {
                            role: "system",
                            content: mode.systemPrompt
                        },
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
        async invoke(cfg, payload, requestConfig) {
            const mode = getMode(requestConfig);
            const userPrompt = buildPrompt(
                payload,
                requestConfig?.mode,
                cfg.max_sentences,
                cfg.max_words,
            );
            const res = await fetch("https://api.together.xyz/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfg.apiKey}`
                },
                body: JSON.stringify({
                    model: cfg.model || "meta-llama/Llama-3.2-3B-Instruct-Turbo",
                    temperature: mode.temperature,
                    max_tokens: cfg.maxTokens || 200,
                    messages: [
                        {
                            role: "system",
                            content: mode.systemPrompt
                        },
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
        async invoke(cfg, payload, requestConfig) {
            const mode = getMode(requestConfig);
            const userPrompt = buildPrompt(
                payload,
                requestConfig?.mode,
                cfg.max_sentences,
                cfg.max_words,
            );
            const model = cfg.model || "deepseek-ai/DeepSeek-R1:fastest";

            const res = await fetch(
                `https://router.huggingface.co/v1/chat/completions`, // new URL
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${cfg.apiKey}`
                    },
                    body: JSON.stringify({
                        model,  // model goes in body, not URL
                        temperature: mode.temperature,
                        max_tokens: cfg.maxTokens || 200,
                        messages: [
                            { role: "system", content: mode.systemPrompt },
                            { role: "user", content: userPrompt }
                        ]
                    })
                }
            );

            if (!res.ok) {
                const errText = await res.text();
                try {
                    const errJson = JSON.parse(errText);
                    throw new Error(errJson.error?.message || errText);
                } catch {
                    throw new Error(errText);
                }
            }

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
            return data.choices[0].message.content;
        }
    },

    ollama: {
        async invoke(cfg, payload, requestConfig) {
            const mode = getMode(requestConfig);
            const userPrompt = buildPrompt(
                payload,
                requestConfig?.mode,
                cfg.max_sentences,
                cfg.max_words,
            );
            const base = (cfg.baseUrl || "http://localhost:11434").replace(/\/$/, "");
            const res = await fetch(`${base}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: cfg.model || "llama3.2",
                    stream: false,
                    options: {
                        temperature: mode.temperature
                    },
                    messages: [
                        {
                            role: "system",
                            content: mode.systemPrompt
                        },
                        { role: "user", content: userPrompt }
                    ]
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Ollama request failed.");
            if (!data.message?.content) throw new Error("Ollama returned an empty response.");
            return data.message.content;
        }
    },

    custom: {
        async invoke(cfg, payload, requestConfig) {
            const mode = getMode(requestConfig);
            const userPrompt = buildPrompt(
                payload,
                requestConfig?.mode,
                cfg.max_sentences,
                cfg.max_words,
            );
            const res = await fetch(cfg.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(cfg.apiKey ? { "Authorization": `Bearer ${cfg.apiKey}` } : {})
                },
                body: JSON.stringify({
                    model: cfg.model || "default",
                    temperature: mode.temperature,
                    max_tokens: cfg.maxTokens || 200,
                    messages: [
                        {
                            role: "system",
                            content: mode.systemPrompt
                        },
                        { role: "user", content: userPrompt }
                    ]
                })
            });
            const data = await res.json();
            const result =
                data.choices?.[0]?.message?.content ||
                data.content?.[0]?.text ||
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                data.response || data.text || data.output;

            if (!result) throw new Error("Custom provider returned an unrecognised response shape.");
            return result;
        }
    }
};

// Global function called by content.js
async function runChain(cfg, payload, requestConfig) {
    const provider = PROVIDERS[cfg.provider];

    if (!provider) {
        throw new Error(`Unknown provider: ${cfg.provider}`);
    }

    return provider.invoke(
        cfg,
        payload,
        requestConfig
    );
}