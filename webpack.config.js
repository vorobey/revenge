var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const METADATA =  {
    host: 'localhost',
    port: 5067,
    ENV: ENV
};

module.exports = {

    entry: './assets/js/app.js',
    output: {
        filename: './dist/js/app.js'
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.sass$/i,
                loader: ExtractTextPlugin.extract("style", "raw!sass")
            }
        ]
    },
    devServer: {
        port: METADATA.port,
        host: METADATA.host,
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        outputPath: './dist'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'assets/files/', to: 'dist/files' },
            { from: 'assets/images/', to: 'dist/images' }
        ], {
            copyUnmodified: true
        }),
        new ExtractTextPlugin("dist/css/style.min.css")
    ],
    resolve: {
        extensions: ['', '.js', '.es6']
    }
};