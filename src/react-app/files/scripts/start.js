#!/usr/bin/env node
const webpack = require('webpack');
const webpackDevMiddleWare = require('webpack-dev-middleware');

const webpackHotMiddleWare = require('webpack-hot-middleware');
const webpackConfig = require('../webpack/dev');
const WebServer = require('./WebServer');

const compiler = webpack(webpackConfig);

const server = new WebServer({
    publicPath: webpackConfig.output.publicPath,
    buildPath: webpackConfig.output.path
});
server.use(webpackDevMiddleWare(compiler, {
    publicPath: webpackConfig.output.publicPath
})).use(webpackHotMiddleWare(compiler));
server.startByWebpack(compiler);
