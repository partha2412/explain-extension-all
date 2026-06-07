# Explain This

**Explain This** is a lightweight, privacy-friendly Chrome Extension that helps users understand complex content instantly. Simply highlight any text on a webpage, click **Explain**, and receive a concise, context-aware explanation powered by your preferred AI model.

The extension supports both cloud-based and local LLMs, allowing users to choose the provider that best fits their workflow.

## ✨ Features

- Instant explanations for selected text on any webpage
- Context-aware responses using surrounding page content
- Clean, non-intrusive floating UI
- Support for multiple AI providers
- Automatic provider detection from API keys
- Local model support via Ollama
- No backend infrastructure required
- Modern dark-themed interface
- Secure local configuration storage

## 🤖 Supported Providers

- OpenAI
- Anthropic Claude
- Google Gemini
- Groq
- Mistral AI
- Together AI
- Hugging Face Inference
- Ollama (Local Models)
- Custom OpenAI-Compatible APIs

## 🚀 Installation

### From Source

1. Clone the repository

```bash
git clone https://github.com/yourusername/explain-this.git
cd explain-this
```

2. Open Chrome and navigate to:

```text
chrome://extensions
```

3. Enable **Developer Mode**

4. Click **Load Unpacked**

5. Select the project folder

The extension is now ready to use.

## ⚙️ Configuration

1. Click the extension icon.
2. Enter your API key.
3. The provider will be detected automatically.
4. Select a model or enter a custom one.
5. Save your settings.

### Using Ollama

For local models:

```text
API Key: ollama
Base URL: http://localhost:11434
```

## 📖 Usage

1. Open any webpage.
2. Highlight a word, sentence, or paragraph.
3. Click the **Explain** button that appears.
4. Receive a simple, AI-generated explanation instantly.

## 🏗️ Project Structure

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

## 🔒 Privacy

- No backend servers
- No analytics or tracking
- API keys stored locally using Chrome Storage
- Requests are sent directly to the selected AI provider

## 🛠️ Tech Stack

- JavaScript (Vanilla)
- HTML5
- CSS3
- Chrome Extension Manifest V3
- Multiple LLM APIs

## 📄 License

This project is licensed under the MIT License.

---

Built for students, developers, researchers, and anyone who wants quick explanations without leaving the page.
