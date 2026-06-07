<div align="center">

# Explain This

AI-powered Chrome Extension that explains selected text anywhere on the web.

Highlight text → Click Explain → Get a simple explanation instantly.

Supports OpenAI, Claude, Gemini, Groq, Mistral, Hugging Face, Together AI, Ollama, and custom APIs.

</div>

---

## Demo

### Select Any Text

```text
Quantum entanglement is a physical phenomenon...
```

↓

### Click Explain

```text
[ Explain ]
```

↓

### Get a Simple Explanation

```text
Quantum entanglement is when two particles become connected
so that a change in one can affect the other, even when
they are far apart.
```

---

## Why Use It?

When reading:

- Research Papers
- Documentation
- Technical Blogs
- News Articles
- Educational Content

You often encounter difficult terms and concepts.

Instead of opening a new tab and searching manually, simply highlight the text and let AI explain it directly on the page.

---

## Features

✨ Explain selected text instantly

🧠 Context-aware explanations

⚡ Floating one-click interface

🌐 Works on almost any website

🤖 Multiple AI providers

🏠 Local model support via Ollama

🔒 Privacy friendly

🎨 Modern dark UI

---

## Supported AI Providers

| Provider | Support |
|-----------|----------|
| OpenAI | ✅ |
| Claude | ✅ |
| Gemini | ✅ |
| Groq | ✅ |
| Mistral | ✅ |
| Together AI | ✅ |
| Hugging Face | ✅ |
| Ollama | ✅ |
| Custom APIs | ✅ |

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/partha2412/explain-extension-all.git
```

### 2. Open Chrome Extensions

```text
chrome://extensions
```

### 3. Enable Developer Mode

Turn on **Developer Mode** in the top-right corner.

### 4. Load Extension

Click:

```text
Load Unpacked
```

Select the project folder.

---

## Setup

### Cloud Models

1. Open the extension popup
2. Paste your API key
3. Provider is detected automatically
4. Select a model
5. Save settings

### Ollama

Start Ollama:

```bash
ollama serve
```

Pull a model:

```bash
ollama pull llama3.2
```

Configure:

```text
API Key: ollama

Base URL:
http://localhost:11434
```

Save settings.

---

## Usage

### Step 1

Open any webpage.

### Step 2

Highlight text.

### Step 3

Click the floating **Explain** button.

### Step 4

Receive an AI-generated explanation instantly.

---

## How It Works

```text
Text Selection
      ↓
Context Extraction
      ↓
Prompt Generation
      ↓
AI Provider
      ↓
Explanation
      ↓
Floating Result Card
```

The extension uses the selected text along with nearby content to generate more accurate explanations.

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

---

## Privacy

- No backend server
- No analytics
- No tracking
- API keys stored locally
- Direct communication with AI providers

---

## License

MIT License
