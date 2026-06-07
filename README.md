<div align="center">

# Explain This

AI-powered Chrome Extension that explains selected text anywhere on the web using your preferred LLM.

**Highlight Text → Click Explain → Get an Instant AI Explanation**

Supports OpenAI, Claude, Gemini, Groq, Mistral, Hugging Face, Together AI, Ollama, and custom OpenAI-compatible APIs.

</div>

---

## Demo

### 1. Enter Your API Key and Save Settings

<p align="center">
  <img src="https://github.com/user-attachments/assets/c5facd7a-5322-467c-852e-6e0a1ca37535" width="320" alt="Extension Settings">
</p>

The extension automatically detects your AI provider, suggests supported models, and lets you configure explanation preferences.

---

### 2. Select Any Text and Click Explain

<p align="center">
  <img width="469" height="269" alt="image" src="https://github.com/user-attachments/assets/3fd4663e-4414-4118-b647-7498ae7e5b2d" />
</p>

Highlight any word, sentence, code snippet, or paragraph. A floating **Explain** button appears directly beside the selection.

---

### 3. Get an AI-Powered Explanation

<p align="center">
  <img width="476" height="444" alt="image" src="https://github.com/user-attachments/assets/b0bfc581-cb19-4bb4-a75f-f7b92cf84d6c" />
</p>

The extension sends the selected text together with surrounding page context to your configured AI model and displays a concise explanation directly on the page.

---

## Why Use It?

While reading:

* Research Papers
* Documentation
* Technical Blogs
* News Articles
* Educational Content
* Tutorials
* Code Examples

You often encounter concepts that need additional explanation.

Instead of opening ChatGPT in another tab and manually copying text, simply highlight the content and let AI explain it instantly.

---

## Features

### AI-Powered Explanations

* Context-aware explanations
* Uses surrounding page content for better understanding
* Works with words, phrases, paragraphs, and code snippets
* Avoids dictionary-style definitions whenever possible

### Multiple Explanation Styles

Choose how explanations are generated:

* Normal
* ELI5 (Simple)
* Technical
* Summary

### Multi-Provider Support

* OpenAI
* Claude
* Gemini
* Groq
* Mistral
* Together AI
* Hugging Face
* Ollama
* Custom OpenAI-Compatible APIs

### User Experience

* Floating one-click interface
* Modern dark UI
* Model selection
* Copy explanation button
* Loading skeleton animations
* Automatic provider detection

### Privacy Friendly

* No backend server
* No analytics
* No tracking
* API keys stored locally
* Direct communication with providers

---

## Supported Providers

| Provider           | Supported |
| ------------------ | --------- |
| OpenAI             | ✅         |
| Claude (Anthropic) | ✅         |
| Gemini             | ✅         |
| Groq               | ✅         |
| Mistral            | ✅         |
| Together AI        | ✅         |
| Hugging Face       | ✅         |
| Ollama             | ✅         |
| Custom APIs        | ✅         |

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

Enable **Developer Mode** from the top-right corner.

### 4. Load the Extension

Click:

```text
Load Unpacked
```

Select the cloned project folder.

---

## Setup

### Cloud Models

1. Open the extension popup
2. Enter your API key
3. Provider is detected automatically
4. Select a model
5. Choose an explanation style
6. Save settings

### For Ollama

Start Ollama:

```bash
ollama serve
```

Download a model:

```bash
ollama pull llama3.2
```

Configure the extension:

```text
API Key: ollama

Base URL:
http://localhost:11434
```

Save settings and start using local models.

---

## How It Works

```text
User Selects Text
        ↓
Context Extraction
        ↓
Prompt Generation
        ↓
Selected AI Provider
        ↓
AI Response
        ↓
Floating Explanation Card
```

The extension combines the selected text with nearby page content to generate context-aware explanations rather than simple dictionary definitions.

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
├── LICENSE
└── README.md
```

---

## Privacy

Your data stays under your control.

* No backend infrastructure
* No cloud relay servers
* No telemetry
* No tracking
* API keys stored locally using Chrome Storage
* Requests sent directly to the provider you configure

---

## License

This project is licensed under a custom Non-Commercial License.

Commercial use, resale, SaaS offerings, paid integrations, redistribution for profit, or monetization of this software is prohibited without prior written permission from the author.

See the LICENSE file for full details.

---

## Roadmap

Planned future improvements:

* Keyboard shortcuts
* Streaming responses
* Better page context extraction
* Explanation history
* Chrome Web Store release

---

Made with ❤️ for students, developers, researchers, and curious readers.
