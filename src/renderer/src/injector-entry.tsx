import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n';
import './styles/app.css';

function mountAnvilSidebar() {
  if (document.getElementById('anvilcss-root')) return;
  const host = document.createElement('div');
  host.id = 'anvilcss-root';
  document.body.appendChild(host);
  ReactDOM.createRoot(host).render(
    <React.StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </React.StrictMode>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAnvilSidebar, { once: true });
} else {
  mountAnvilSidebar();
}
