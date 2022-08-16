module.exports = {
    max_memory_restart: '2048M',
    apps: [
        {
            name: 'myhome',
            script: './build/bundle.js',
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
