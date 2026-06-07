# Explain This

<div align="center">

AI-powered Chrome Extension that explains selected text on any webpage using your preferred LLM.

Supports OpenAI, Claude, Gemini, Groq, Mistral, Together AI, Hugging Face, Ollama, and custom OpenAI-compatible APIs.

</div>

---

## Overview

Reading technical articles, research papers, documentation, blogs, or educational content often requires switching tabs to understand unfamiliar concepts.

**Explain This** solves that problem by allowing you to highlight any text on a webpage and instantly receive a simple, context-aware explanation without leaving the page.

The extension uses surrounding content to better understand the selected text and generate more accurate explanations.

---

## Features

✅ Highlight any text on any webpage

✅ Context-aware explanations using surrounding content

✅ Floating "Explain" button for quick access

✅ Clean and modern dark UI

✅ Supports multiple AI providers

✅ Automatic provider detection from API keys

✅ Local LLM support via Ollama

✅ No backend server required

✅ API keys stored locally

✅ Lightweight and fast

---

## Supported Providers

| Provider | Supported |
|-----------|------------|
| OpenAI | ✅ |
| Anthropic Claude | ✅ |
| Google Gemini | ✅ |
| Groq | ✅ |
| Mistral AI | ✅ |
| Together AI | ✅ |
| Hugging Face | ✅ |
| Ollama | ✅ |
| Custom OpenAI-Compatible APIs | ✅ |

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/partha2412/explain-extension-all.git
cd explain-extension-all
```

### Load into Chrome

1. Open Chrome

```
chrome://extensions
```

2. Enable **Developer Mode**

3. Click **Load unpacked**

4. Select the project folder

5. Pin the extension from the Chrome toolbar

The extension is now ready to use.

---

## Configuration

### Cloud AI Providers

1. Click the extension icon
2. Paste your API key
3. Provider is detected automatically
4. Select a model (optional)
5. Click **Save Settings**

### OpenAI Example

```text
sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### Claude Example

```text
sk-ant-xxxxxxxxxxxxxxxx
```

### Gemini Example

```text
AIzaxxxxxxxxxxxxxxxx
```

---

## Using Ollama

### Start Ollama

```bash
ollama serve
```

### Pull a Model

```bash
ollama pull llama3.2
```

### Configure Extension

```text
API Key: ollama

Base URL:
http://localhost:11434
```

Save settings and start using local models immediately.

---

## Usage

### Step 1

Open any webpage.

### Step 2

Highlight a word, sentence, or paragraph.

### Step 3

Click the floating **Explain** button.

### Step 4

Wait a few seconds while the AI processes the request.

### Step 5

Read the simplified explanation directly on the page.

---

## How It Works

```text
User Selects Text
        │
        ▼
Context Extraction
        │
        ▼
Prompt Generation
        │
        ▼
Selected LLM Provider
        │
        ▼
AI Response
        │
        ▼
Floating Explanation Card
```

The extension captures:

- Selected text
- ~350 characters before the selection
- ~350 characters after the selection

This additional context helps the model produce more relevant explanations.

---

## Project Structure

```text
.
├── manifest.json
├── content.js
├── content.css
├── llm.js
├── popup.html
├── popup.js
├── icon.svg
└── README.md
```

### Files

| File | Purpose |
|--------|---------|
| manifest.json | Chrome extension configuration |
| content.js | Selection handling and tooltip logic |
| content.css | Extension styling |
| llm.js | AI provider integrations |
| popup.html | Settings UI |
| popup.js | Configuration management |

---

## Privacy

This project is designed with privacy in mind.

- No backend server
- No analytics
- No tracking
- API keys stored locally
- Requests sent directly to the selected provider
- Full control over your chosen AI model

---

## Supported Models

Examples include:

### OpenAI

- gpt-4o-mini
- gpt-4o
- gpt-4-turbo

### Claude

- Claude Haiku
- Claude Sonnet
- Claude Opus

### Gemini

- Gemini Flash
- Gemini Pro

### Ollama

- llama3.2
- llama3.1
- mistral
- phi3
- gemma2
- qwen2.5

Custom models can also be entered manually.

---

## Future Improvements

- Streaming responses
- Translation mode
- Summarization mode
- Explain images
- Multiple explanation styles
- Keyboard shortcuts
- Response caching
- Chat mode
- Custom prompts

---

## Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## License

MIT License

Feel free to use, modify, and distribute this project.

---

Made for students, developers, researchers, and curious minds who want quick explanations without leaving the page.
