const path = require('path');

module.exports = {
    max_memory_restart: '2048M',
    apps: [
        {
            name: 'myhome',
            script: path.resolve(__dirname, 'bundle.js'),
            instances: 'max',
            exec_mode: 'cluster'
        }
    ],
    env: {
        NODE_ENV: 'production',
        PORT: 8080,
        HOST: '127.0.0.1' // default
    }
};
