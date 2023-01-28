const path = require('path');

module.exports = {
    max_memory_restart: '2048M',
    apps: [
        {
            name: 'myhome',
            script: path.resolve(__dirname, 'bundle.js'),
            args: 'NODE_TLS_REJECT_UNAUTHORIZED',
            instances: 'max',
            exec_mode: 'cluster'
        }
    ],
    env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '127.0.0.1' // default
    }
};
