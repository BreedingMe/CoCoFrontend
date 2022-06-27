const htmlLoaderPreprocessor = require('./preprocessor/html-loader-preprocessor');

const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const path = require('path');
const portfinder = require('portfinder');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    mode: 'development',
    context: path.resolve(__dirname, '../'),
    entry: './src/js/main.js',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        host: 'localhost',
        port: null,
        contentBase: false,
        compress: true,
        inline: true,
        hot: true,
        clientLogLevel: 'warning',
        overlay: true,
        quiet: true,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    preprocessor: htmlLoaderPreprocessor.nestedHtmlPreprocessor
                }
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader'
            },
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: '/node_modules/',
                options: {
                    formatter: eslintFriendlyFormatter,
                    emitWarning: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static',
                ignore: ['.*']
            }
        ]),
        new Dotenv({
            path: './.env/development.env'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        })
    ]
};

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = 5000;

    portfinder.getPort((error, port) => {
        if (error == null) {
            config.devServer.port = port;

            config.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${config.devServer.host}:${port}`]
                }
            }));

            resolve(config);
        }
        else {
            reject(error);
        }
    });
});