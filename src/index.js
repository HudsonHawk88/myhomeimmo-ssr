import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import App from './App';

const history = createBrowserHistory();
const container = document.getElementById('root');

const root = hydrateRoot(container,
     <Router>
        <App serverData={window.__INITIAL_DATA__} history={history} />
    </Router>
);
