const KEY_MAP = [
  { prefix: "sk-ant-",  provider: "anthropic",   label: "Claude (Anthropic)" },
  { prefix: "sk-proj-", provider: "openai",       label: "OpenAI" },
  { prefix: "sk-",      provider: "openai",       label: "OpenAI" },
  { prefix: "AIza",     provider: "gemini",       label: "Google Gemini" },
  { prefix: "gsk_",     provider: "groq",         label: "Groq" },
  { prefix: "hf_",      provider: "huggingface",  label: "HuggingFace" },
  { prefix: "tog_",     provider: "together",     label: "Together AI" },
];

const MODELS = {
  openai: [
    "gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"
  ],
  anthropic: [
    "claude-haiku-4-5-20251001", "claude-sonnet-4-20250514", "claude-opus-4-20250514"
  ],
  gemini: [
    "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.5-pro"
  ],
  groq: [
    "llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768", "gemma2-9b-it"
  ],
  mistral: [
    "mistral-small-latest", "mistral-medium-latest", "mistral-large-latest", "open-mistral-7b"
  ],
  together: [
    "meta-llama/Llama-3.2-3B-Instruct-Turbo", "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "mistralai/Mixtral-8x7B-Instruct-v0.1", "Qwen/Qwen2.5-72B-Instruct-Turbo"
  ],
  huggingface: [
    "mistralai/Mistral-7B-Instruct-v0.3", "HuggingFaceH4/zephyr-7b-beta",
    "Qwen/Qwen2.5-7B-Instruct", "microsoft/Phi-3.5-mini-instruct"
  ],
  ollama: [
    "llama3.2", "llama3.1", "mistral", "phi3", "gemma2", "qwen2.5"
  ],
};

function detectProvider(key) {
  if (!key) return null;
  for (const { prefix, provider, label } of KEY_MAP) {
    if (key.startsWith(prefix)) return { provider, label };
  }
  if (key.length > 20) return { provider: "mistral", label: "Mistral AI (assumed)" };
  return null;
}

// Elements
const apiKeyInput  = document.getElementById("api-key");
const baseUrlInput = document.getElementById("base-url");
const modelInput   = document.getElementById("model");
const maxTokensEl  = document.getElementById("max-tokens");
const toggleVis    = document.getElementById("toggle-vis");
const saveBtn      = document.getElementById("save-btn");
const statusEl     = document.getElementById("status");
const badge        = document.getElementById("detected-badge");
const fieldUrl     = document.getElementById("field-url");
const fieldModel   = document.getElementById("field-model");
const modelPills   = document.getElementById("model-pills");
const styleEl = document.getElementById("explain-style");
const maxSentences = document.getElementById("max-sentences");
const maxWords = document.getElementById("max-words");

let currentProvider = null;

function renderModelPills(provider, selectedModel) {
  modelPills.innerHTML = "";
  const models = MODELS[provider] || [];
  models.forEach(m => {
    const btn = document.createElement("button");
    btn.className = "mpill" + (m === selectedModel ? " active" : "");
    // Show short name for long HF/Together model IDs
    btn.textContent = m.includes("/") ? m.split("/")[1] : m;
    btn.title = m; // full name on hover
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mpill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      modelInput.value = m;
    });
    modelPills.appendChild(btn);
  });
  fieldModel.classList.remove("hidden");
}

// Typing in model box clears pill selection
modelInput.addEventListener("input", () => {
  document.querySelectorAll(".mpill").forEach(p => p.classList.remove("active"));
  // Highlight if typed value matches a pill
  const val = modelInput.value.trim();
  document.querySelectorAll(".mpill").forEach(p => {
    if (p.title === val) p.classList.add("active");
  });
});

apiKeyInput.addEventListener("input", () => {
  const key = apiKeyInput.value.trim();
  const isOllama = key.trim().toLowerCase() === "ollama";

  if (isOllama) {
    badge.textContent = "✓ Ollama (local)";
    badge.className = "badge";
    fieldUrl.classList.remove("hidden");
    currentProvider = "ollama";
    renderModelPills("ollama", modelInput.value);
    return;
  }

  if (!key) {
    badge.textContent = "No key detected";
    badge.className = "badge none";
    fieldModel.classList.add("hidden");
    fieldUrl.classList.add("hidden");
    return;
  }
  
  const detected = detectProvider(key);
  if (detected) {
    badge.textContent = "✓ " + detected.label;
    badge.className = "badge";
    fieldUrl.classList.add("hidden");
    currentProvider = detected.provider;
    renderModelPills(detected.provider, modelInput.value);
  } else {
    badge.textContent = key.length > 0 ? "Unrecognized key" : "No key detected";
    badge.className = "badge none";
    fieldUrl.classList.add("hidden");
    fieldModel.classList.add("hidden");
    currentProvider = null;
  }
});

toggleVis.addEventListener("click", () => {
  const isPass = apiKeyInput.type === "password";
  apiKeyInput.type = isPass ? "text" : "password";
  toggleVis.textContent = isPass ? "hide" : "show";
});

saveBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  const isOllama = key.trim().toLowerCase() === "ollama";
  const detected = isOllama
    ? { provider: "ollama", label: "Ollama" }
    : detectProvider(key);

  if (!detected) {
    flash("Couldn't detect provider from key", "#f87171");
    return;
  }

  const cfg = {
    provider:  detected.provider,
    apiKey:    isOllama ? null : key,
    baseUrl:   baseUrlInput.value.trim() || null,
    model:     modelInput.value.trim()   || null,
    maxTokens: parseInt(maxTokensEl.value) || 200,
    max_sentences: parseInt(maxSentences.value),
    max_words: parseInt(maxWords.value),
    style: styleEl.value
  };

  chrome.storage.local.set({ et_config: cfg }, () => {
    flash(`<i class="fa-solid fa-check"></i> Saved — ${detected.label}`, "#4ade80");
  });
});

function flash(msg, color) {
  statusEl.style.color = color;
  statusEl.innerHTML = msg;
  setTimeout(() => statusEl.textContent = "", 3000);
}

// Load saved config
chrome.storage.local.get(["et_config"], r => {
  const cfg = r.et_config;
  if (!cfg) return;
  if (cfg.apiKey)    apiKeyInput.value  = cfg.apiKey;
  if (cfg.baseUrl)   baseUrlInput.value = cfg.baseUrl;
  if (cfg.maxTokens) maxTokensEl.value  = cfg.maxTokens;
  if (cfg.max_sentences) maxSentences.value = cfg.max_sentences;
  if (cfg.max_words) maxWords.value = cfg.max_words;
  if (cfg.style) styleEl.value = cfg.style;

  // Trigger detection + render pills with saved model pre-selected
  apiKeyInput.dispatchEvent(new Event("input"));

  // After pills render, set saved model
  if (cfg.model) {
    modelInput.value = cfg.model;
    document.querySelectorAll(".mpill").forEach(p => {
      if (p.title === cfg.model) p.classList.add("active");
    });
  }
});