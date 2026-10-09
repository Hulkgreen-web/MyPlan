import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './presentation/i18n/config.ts';

async function prepareApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const isDemoQuery = urlParams.get('demo') === 'true';

  if (isDemoQuery) {
    const { worker } = await import('./mocks/browser.ts');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

prepareApp().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
