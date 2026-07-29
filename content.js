// content.js
(() => {
  let tooltipEl = null;
  let currentSelection = null;
  let currentContextText = null;

  const fa = document.createElement("link");
  fa.rel = "stylesheet";
  fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css";
  document.head.appendChild(fa);

  function getSurroundingContext(maxLen) {
    const selection = window.getSelection();

    if (!selection.rangeCount) return "";

    const range = selection.getRangeAt(0);

    let node = range.commonAncestorContainer;

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    const parent =
      node.closest("article, section, main, p, div") || node;

    let context = "";

    if (parent.previousElementSibling) {
      context += parent.previousElementSibling.innerText + "\n\n";
    }

    context += parent.innerText + "\n\n";

    if (parent.nextElementSibling) {
      context += parent.nextElementSibling.innerText;
    }

    return context.slice(0, maxLen || 1500);
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
    let left = x - tw / 2;
    let top = y - th - 12;

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

  function repositionTooltip() {
    if (!tooltipEl) return;

    requestAnimationFrame(() => {
      const rect = tooltipEl.getBoundingClientRect();

      const GAP = 12;

      let left = rect.left;
      let top = rect.top;

      // Right overflow
      if (left + rect.width > window.innerWidth - GAP) {
        left = window.innerWidth - rect.width - GAP;
      }

      // Left overflow
      if (left < GAP) {
        left = GAP;
      }

      // Bottom overflow
      if (top + rect.height > window.innerHeight - GAP) {
        top = window.innerHeight - rect.height - GAP;
      }

      // Top overflow
      if (top < GAP) {
        top = GAP;
      }

      tooltipEl.style.left = `${left + window.scrollX}px`;
      tooltipEl.style.top = `${top + window.scrollY}px`;
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
    repositionTooltip();
  }

  function showResult(text) {
    if (!tooltipEl) return;

    tooltipEl.innerHTML = `
    <div class="et-card">
      <div class="et-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        Explanation
        <button id="copy-btn" title="Copy">
          <i class="fa-solid fa-copy"></i>
        </button>
      </div>

      <div class="et-body"></div>

      <button class="et-close" id="et-close-btn">✕ Close</button>
    </div>
  `;
    repositionTooltip();

    const body = tooltipEl.querySelector(".et-body");

    // Split by ```code```
    const parts = text.split(/```([\s\S]*?)```/g);

    parts.forEach((part, index) => {
      // Even index = normal text
      if (index % 2 === 0) {
        if (part.trim()) {
          const p = document.createElement("p");
          p.textContent = part.trim();
          body.appendChild(p);
        }
      }
      // Odd index = code block
      else {
        const wrapper = document.createElement("div");
        wrapper.className = "code-wrapper";

        wrapper.innerHTML = `
        <button class="code-copy-btn" title="Copy">
          <i class="fa-solid fa-copy"></i>
        </button>
        <pre><code>${escapeHtml(part.trim())}</code></pre>
      `;

        const btn = wrapper.querySelector(".code-copy-btn");

        btn.addEventListener("click", async (e) => {
          e.stopPropagation();

          await navigator.clipboard.writeText(part.trim());

          btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
          setTimeout(() => {
            btn.innerHTML = `<i class="fa-solid fa-copy"></i>`;
          }, 1200);
        });

        body.appendChild(wrapper);
      }
    });

    // Main explanation copy button
    document.getElementById("copy-btn").addEventListener("click", async (e) => {
      e.stopPropagation();

      await navigator.clipboard.writeText(body.innerText);

      const btn = document.getElementById("copy-btn");
      btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
      setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-copy"></i>`;
      }, 1200);
    });

    document
      .getElementById("et-close-btn")
      .addEventListener("click", removeTooltip);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function showError(msg) {
    if (!tooltipEl) return;
    tooltipEl.innerHTML = `
      <div class="et-card et-error-card">
        <div class="et-header">⚠ Error</div>
        <div class="et-body">${msg}</div>
        <button class="et-close" id="et-close-btn">✕ Close</button>
      </div>`;
    repositionTooltip();
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
    if (!cfg.apiKey && cfg.provider !== "ollama") {
      showError("No API key set. Click the extension icon.");
      return;
    }

    showLoading();

    const payload = {
      text: currentSelection,
      context: currentContextText
    };

    try {
      const requestConfig = {
        mode: cfg.style || "normal"
      };

      const result = await runChain(
        cfg,
        payload,
        requestConfig
      );
      showResult(result);
    } catch (err) {
      let msg = err.message || "Something went wrong.";
      try {
        const parsed = JSON.parse(msg);
        msg = parsed.error?.message || msg;
      } catch { }
      showError(msg);
    }
  }

  // Selection Handler
  document.addEventListener("click", e => {
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();

      if (text && text.length > 3) {
        currentSelection = text;
        chrome.storage.local.get(["et_config"], r => {
          const maxContext = r.et_config?.maxContext || 1500;
          currentContextText = getSurroundingContext(maxContext);
        });

        const rect = sel.getRangeAt(0).getBoundingClientRect();
        createTooltip(rect.left + rect.width / 2, rect.top);
      } else if (!tooltipEl?.contains(e.target)) {
        removeTooltip();
      }
    }, 60);
  });

  document.addEventListener("mouseup", e => {
    if (tooltipEl && !tooltipEl.contains(e.target)) {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text || text.length <= 3) {
        removeTooltip();
      }
    }
  });

  document.addEventListener("scroll", () => {
    if (tooltipEl && !tooltipEl.querySelector(".et-card")) {
      removeTooltip();
    }
  });

  // Clipboard approach for Monaco (LeetCode)
  document.addEventListener('copy', e => {
      setTimeout(() => {
        navigator.clipboard.readText().then(text => {
          text = text?.trim();
          if (text && text.length > 3) {
            currentSelection = text;
            currentContextText = text;
            // Show tooltip at center of screen
            createTooltip(window.innerWidth / 2, window.innerHeight / 2);
          }
        }).catch(() => { });
      }, 100);
  });
})();