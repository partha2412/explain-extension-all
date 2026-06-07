// content.js
(() => {
  let tooltipEl = null;
  let currentSelection = null;
  let currentContextText = null;

  function getSurroundingContext(selectedText) {
    const fullText = document.body.innerText || "";
    const idx = fullText.indexOf(selectedText);

    if (idx === -1) {
      return selectedText; // Fallback
    }

    // Get context before and after
    const before = fullText.slice(Math.max(0, idx - 350), idx).trim();
    const after = fullText.slice(idx + selectedText.length, idx + selectedText.length + 350).trim();

    // Clean up and combine
    let context = "";
    if (before) context += before + " ";
    context += selectedText + " ";
    if (after) context += after;

    return context.trim();
  }

  function removeTooltip() {
    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
    currentContextText = null;
  }

  function createTooltip(x, y) {
    removeTooltip();
    tooltipEl = document.createElement("div");
    tooltipEl.className = "et-tooltip";
    tooltipEl.innerHTML = `
      <button class="et-btn" id="et-explain-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        Explain
      </button>`;
    document.body.appendChild(tooltipEl);

    const tw = tooltipEl.offsetWidth, th = tooltipEl.offsetHeight, vw = window.innerWidth;
    let left = x - tw / 2, top = y - th - 12;

    if (left < 8) left = 8;
    if (left + tw > vw - 8) left = vw - tw - 8;
    if (top < 8) top = y + 20;

    tooltipEl.style.left = `${left + window.scrollX}px`;
    tooltipEl.style.top = `${top + window.scrollY}px`;

    document.getElementById("et-explain-btn").addEventListener("click", e => {
      e.stopPropagation();
      handleExplain();
    });
  }

  function showLoading() {
    if (!tooltipEl) return;
    tooltipEl.innerHTML = `
      <div class="et-card et-loading-card">
        <div class="et-skeleton-header">
          <div class="et-skeleton-icon"></div>
          <div class="et-skeleton-title"></div>
        </div>
        <div class="et-skeleton-body">
          <div class="et-skeleton-line"></div>
          <div class="et-skeleton-line"></div>
          <div class="et-skeleton-line"></div>
          <div class="et-skeleton-line short"></div>
        </div>
        <div class="et-loading-text">Getting explanation...</div>
      </div>`;
  }

  function showResult(text) {
    if (!tooltipEl) return;
    tooltipEl.innerHTML = `
      <div class="et-card">
        <div class="et-header">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          Explanation
          <button id="copy-btn" title="Copy">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <div class="et-body">${text}</div>
        <button class="et-close" id="et-close-btn">✕ Close</button>
      </div>`;
    document.getElementById("copy-btn").addEventListener("click", async (e) => {
      e.stopPropagation();

      const content =
        document.querySelector(".et-body")?.innerText || "";

      try {
        await navigator.clipboard.writeText(content);

        const btn = document.getElementById("copy-btn");

        btn.innerHTML = "✓";

        setTimeout(() => {
          btn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24"
           fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round"
           stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
        }, 1200);

      } catch (err) {
        console.error(err);
      }
    });
    document.getElementById("et-close-btn").addEventListener("click", removeTooltip);
  }

  function showError(msg) {
    if (!tooltipEl) return;
    tooltipEl.innerHTML = `
      <div class="et-card et-error-card">
        <div class="et-header">⚠ Error</div>
        <div class="et-body">${msg}</div>
        <button class="et-close" id="et-close-btn">✕ Close</button>
      </div>`;
    document.getElementById("et-close-btn").addEventListener("click", removeTooltip);
  }

  function getConfig() {
    return new Promise(resolve =>
      chrome.storage.local.get(["et_config"], r => resolve(r.et_config || null))
    );
  }

  async function handleExplain() {
    if (!currentSelection) return;

    const cfg = await getConfig();
    if (!cfg?.provider) {
      showError("Not configured. Click the extension icon to set up.");
      return;
    }
    if (!cfg.apiKey) {
      showError("No API key set. Click the extension icon.");
      return;
    }

    showLoading();

    const userPrompt = `You are a helpful, clear, and concise assistant.

**Selected Text:**
${currentSelection}

**Surrounding Context:**
${currentContextText || currentSelection}

---

Explain the **Selected Text** in simple, very small, easy-to-understand English.
Use the surrounding context to give better understanding when needed.
Don't mention 'The selected text...' insted just give the explaination.
Give the explanation in max 2 to 3 lines only.
Use natural, friendly language. No bullet points. No markdown.`;

    try {
      const result = await runChain(cfg, userPrompt);
      showResult(result);
    } catch (err) {
      console.error(err);
      showError(err.message || "Something went wrong. Please try again.");
    }
  }

  // Selection Handler
  document.addEventListener("click", e => {
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();

      if (text && text.length > 3) {
        currentSelection = text;
        currentContextText = getSurroundingContext(text);

        const rect = sel.getRangeAt(0).getBoundingClientRect();
        createTooltip(rect.left + rect.width / 2, rect.top);
      } else if (!tooltipEl?.contains(e.target)) {
        removeTooltip();
      }
    }, 60);
  });

  document.addEventListener("mouseup", e => {
    if (tooltipEl && !tooltipEl.contains(e.target)) {
      removeTooltip();
    }
  });

  document.addEventListener("scroll", () => {
    if (tooltipEl && !tooltipEl.querySelector(".et-card")) {
      removeTooltip();
    }
  });
})();