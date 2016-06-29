var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
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