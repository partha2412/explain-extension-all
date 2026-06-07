<div align="center">

# Explain This

AI-powered Chrome Extension that explains selected text anywhere on the web.

Highlight text → Click Explain → Get a simple explanation instantly.

Supports OpenAI, Claude, Gemini, Groq, Mistral, Hugging Face, Together AI, Ollama, and custom APIs.

</div>

---

## Demo

### 1. Enter Your API Key and Save Settings

<p align="center">
  <img src="https://github.com/user-attachments/assets/a0c96ea7-c328-4210-84ae-51d2f135af71" width="320" alt="Extension Settings">
</p>

The extension automatically detects the provider from your API key and lets you select a model before saving.

---

### 2. Select Any Text and Click **Explain**

<p align="center">
  <img src="https://github.com/user-attachments/assets/bf14cc34-c5af-4b33-a169-810c4e5f829e" width="700" alt="Select Text and Click Explain">
</p>

Highlight any word, sentence, or paragraph on a webpage. A floating **Explain** button will appear near the selection.

---

### 3. Get an Instant Explanation

<p align="center">
  <img src="https://github.com/user-attachments/assets/ef89e99e-5069-451a-a0d3-3fa666a468ff" width="700" alt="Generated Explanation">
</p>

The extension sends the selected text and surrounding context to your configured AI model and displays a concise explanation directly on the page.

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

This project is licensed under a custom Non-Commercial License.

Commercial use, resale, SaaS offerings, and monetization of this software are prohibited without prior written permission from the author.

See the LICENSE file for details.
