// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';
/* const LoadablePlugin = require('@loadable/webpack-plugin') */

module.exports = {
    mode: isProduction ? 'production' : 'development',
    target: 'node',
    entry: './server/server.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/build'
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new DefinePlugin({
            __isBrowser__: 'false'
        })
        /*         new LoadablePlugin() */
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react', '@babel/preset-env']
                        }
                    }
                ]
            },
            {
                test: /\.(css)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/build/public/styles'
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require('sass'),
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                        }
                    },
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    externals: [webpackNodeExternals(), 'react-helmet', 'canvg', 'html2canvas', 'dompurify'],
    resolve: {
        fallback: {
            child_process: false,
            crypto: false,
            http: false,
            https: false,
            path: false,
            stream: false,
            fs: false,
            os: false,
            uglify_js: false,
            esbuild: false,
            tty: false,
            constants: false,
            vm: false,
            zlib: false
        }
    }
};
