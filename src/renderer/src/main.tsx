import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n';
import appCss from './styles/app.css?inline';

const HOST_ID = 'anvilcss-host';

/**
 * Heuristic Jellyfin detection: jellyfin-web always mounts its SPA into #reactRoot and
 * exposes the global ApiClient. Checking both (rather than just one) avoids a false
 * positive on unrelated pages that happen to reuse one of these names.
 */
function isJellyfinPage(): boolean {
  return (
    document.getElementById('reactRoot') !== null &&
    typeof (window as unknown as { ApiClient?: unknown }).ApiClient !== 'undefined'
  );
}

function mount(): void {
  if (document.getElementById(HOST_ID)) return;

  const host = document.createElement('div');
  host.id = HOST_ID;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = appCss;
  shadow.appendChild(style);

  const mountPoint = document.createElement('div');
  mountPoint.id = 'anvilcss-root';
  shadow.appendChild(mountPoint);

  ReactDOM.createRoot(mountPoint).render(
    <React.StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </React.StrictMode>
  );
}

function boot(): void {
  // Local dev sandbox (`npm run dev`) has no real Jellyfin DOM to wait for — mount immediately.
  if (import.meta.env.DEV) {
    mount();
    return;
  }

  if (isJellyfinPage()) {
    mount();
    return;
  }

  // jellyfin-web renders its app shell asynchronously after the userscript runs at
  // document-idle, so #reactRoot/ApiClient may not exist yet — watch the DOM until they do.
  const observer = new MutationObserver(() => {
    if (isJellyfinPage()) {
      observer.disconnect();
      mount();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Safety backstop: this script's @match is broad, so give up quietly on pages that never
  // turn out to be Jellyfin instead of observing the DOM forever.
  window.setTimeout(() => observer.disconnect(), 30000);
}

if (document.body) {
  boot();
} else {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
}
