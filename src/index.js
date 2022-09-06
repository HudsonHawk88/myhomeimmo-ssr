import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import App from './App';

const history = createBrowserHistory();
const container = document.getElementById('root');
const isBrowser = __isBrowser__;

/* if (isBrowser) {
    const root = createRoot(container);
    root.render(
        <Router>
            <App serverData={window.__INITIAL_DATA__} history={history} />
        </Router>
    );
} else { */
const root = hydrateRoot(
    container,
    <Router>
        <App serverData={window.__INITIAL_DATA__} history={history} />
    </Router>
);
/* } */
