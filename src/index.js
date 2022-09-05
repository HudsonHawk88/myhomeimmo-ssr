import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';

const history = createBrowserHistory();
const container = document.getElementById('root');
const isBrowser = __isBrowser__;

if (isBrowser) {
    const root = createRoot(container);
    root.render(
        <Router>
            <HelmetProvider>
                <App serverData={window.__INITIAL_DATA__} history={history} />
            </HelmetProvider>
        </Router>
    );
} else {
    const root = hydrateRoot(
        container,
        <Router>
            <HelmetProvider>
                <App serverData={window.__INITIAL_DATA__} history={history} />
            </HelmetProvider>
        </Router>
    );
}
