# AI-powered browser extension

AI-powered browser extension that lets users highlight any text on a webpage and instantly receive a simple, context-aware explanation using their preferred LLM provider.

Supports OpenAI, Claude, Gemini, Groq, Mistral, Together AI, HuggingFace, Ollama, and custom OpenAI-compatible APIs.

---

## Features

### Instant Text Explanation
Highlight any text on any webpage and click **Explain** to get a simplified explanation.

### Context-Aware Understanding
The extension captures surrounding text around the selected content, helping the AI generate more accurate and meaningful explanations.

### Multi-Provider LLM Support

Supported providers:

- OpenAI
- Anthropic Claude
- Google Gemini
- Groq
- Mistral AI
- Together AI
- HuggingFace Inference
- Ollama (Local Models)
- Custom OpenAI-Compatible APIs

### Automatic API Key Detection

The extension automatically identifies the provider from the API key format.

| Prefix | Provider |
|----------|----------|
| sk- | OpenAI |
| sk-proj- | OpenAI |
| sk-ant- | Anthropic |
| AIza | Gemini |
| gsk_ | Groq |
| hf_ | HuggingFace |
| tog_ | Together AI |

### Modern User Interface

- Floating Explain button
- Dark theme
- Skeleton loading animations
- Responsive tooltip positioning
- Model selection pills
- Error handling cards

### Local Configuration Storage

Stores:

- API Key
- Provider
- Selected Model
- Ollama Base URL
- Token Limits

No backend server required.

---

# How It Works

## 1. Select Text

Highlight any text on a webpage.

Example:

> Quantum entanglement is a physical phenomenon...

---

## 2. Click Explain

A floating button appears near the selection.

```
[ Explain ]
```

---

## 3. Context Extraction

The extension collects:

- Selected text
- ~350 characters before selection
- ~350 characters after selection

This improves explanation quality.

---

## 4. Prompt Generation

A structured prompt is created:

```text
Selected Text:
...

Surrounding Context:
...

Explain the selected text in simple English.
Use 2-3 lines only.
```

---

## 5. AI Processing

The request is sent to the configured LLM provider.

```text
OpenAI
Claude
Gemini
Groq
Mistral
Together
HuggingFace
Ollama
```

---

## 6. Explanation Display

The response appears inside a floating explanation card directly on the webpage.

---

# Architecture

```text
User Selects Text
        │
        ▼
Content Script
(content.js)
        │
        ▼
Context Extraction
        │
        ▼
Prompt Builder
        │
        ▼
LLM Layer
(llm.js)
        │
        ▼
Selected AI Provider
        │
        ▼
Response
        │
        ▼
Tooltip UI
```

---

# Project Structure

```text
Explain-This/
│
├── manifest.json
│
├── content.js
├── content.css
│
├── llm.js
│
├── popup.html
├── popup.js
│
├── icon.svg
│
└── README.md
```

---

# File Overview

## manifest.json

Chrome Extension configuration.

Responsibilities:

- Registers content scripts
- Injects styles
- Defines permissions
- Configures popup UI
- Grants API access

---

## content.js

Main webpage interaction layer.

Features:

- Detects text selection
- Extracts surrounding context
- Displays Explain button
- Shows loading state
- Shows explanation results
- Handles errors
- Generates prompts
- Calls LLM layer

Key Functions:

```javascript
getSurroundingContext()
createTooltip()
showLoading()
showResult()
showError()
handleExplain()
```

---

## content.css

Provides styling for:

- Floating tooltip
- Explain button
- Explanation card
- Error card
- Loading skeleton
- Animations
- Model pills

Animations include:

- Fade-in
- Hover effects
- Pulse loading
- Bounce loader

---

## llm.js

Unified AI provider layer.

Responsibilities:

- API communication
- Provider routing
- Response normalization
- Error handling

Supported Providers:

```javascript
openai
anthropic
gemini
groq
mistral
together
huggingface
ollama
custom
```

Main Export:

```javascript
runChain()
```

---

## popup.html

Extension settings interface.

Allows users to:

- Enter API keys
- Configure Ollama URL
- Select models
- Set token limits
- Save settings

---

## popup.js

Handles extension configuration logic.

Features:

### Provider Detection

Automatically detects providers from API keys.

```javascript
detectProvider()
```

### Dynamic Model Selection

Renders model options depending on provider.

```javascript
renderModelPills()
```

### Settings Persistence

Stores configuration using:

```javascript
chrome.storage.local
```

---

# Supported Models

## OpenAI

```text
gpt-4o-mini
gpt-4o
gpt-4-turbo
gpt-3.5-turbo
```

## Anthropic

```text
claude-haiku
claude-sonnet
claude-opus
```

## Gemini

```text
gemini-2.0-flash
gemini-1.5-flash
gemini-1.5-pro
gemini-2.5-pro
```

## Groq

```text
llama-3.1-8b-instant
llama-3.3-70b-versatile
mixtral-8x7b
gemma2
```

## Mistral

```text
mistral-small-latest
mistral-medium-latest
mistral-large-latest
```

## Ollama

```text
llama3.2
llama3.1
mistral
phi3
gemma2
qwen2.5
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/explain-this.git
```

---

## Load Extension

1. Open Chrome

```text
chrome://extensions
```

2. Enable **Developer Mode**

3. Click **Load Unpacked**

4. Select the project folder

5. The extension is now installed

---

# Configuration

## OpenAI

```text
API Key:
sk-xxxxxxxxxxxxxxxx
```

Provider automatically detected as:

```text
OpenAI
```

---

## Gemini

```text
API Key:
AIzaxxxxxxxxxxxx
```

Provider automatically detected as:

```text
Google Gemini
```

---

## Claude

```text
API Key:
sk-ant-xxxxxxxx
```

Provider automatically detected as:

```text
Anthropic Claude
```

---

## Ollama

Use:

```text
API Key:
ollama
```

Base URL:

```text
http://localhost:11434
```

---

# Example Workflow

1. Open any webpage.
2. Highlight text.
3. Click **Explain**.
4. Context is collected.
5. AI generates a response.
6. Explanation appears instantly.

---

# Security & Privacy

- No backend server.
- API keys stored locally using Chrome Storage.
- Requests go directly from browser to selected AI provider.
- No user data is collected.
- No analytics or tracking.

---

# Future Improvements

Planned features:

- Streaming responses
- Translation mode
- Summarization mode
- Definition mode
- Multiple explanation styles
- Explain images
- Keyboard shortcuts
- Chat mode
- Prompt customization
- Response caching
- Voice explanations

---

# Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Browser APIs

- Chrome Extension Manifest V3
- Chrome Storage API
- Content Scripts

### AI Providers

- OpenAI API
- Anthropic API
- Google Gemini API
- Groq API
- Mistral API
- Together API
- HuggingFace Inference API
- Ollama API

---

# License

MIT License

Feel free to use, modify, and distribute this project.
