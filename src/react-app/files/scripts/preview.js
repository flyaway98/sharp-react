#!/usr/bin/env node
const WebServer = require('./WebServer');
const webpackConfig = require('../webpack/build');

const server = new WebServer({
    publicPath: webpackConfig.output.publicPath,
    buildPath: webpackConfig.output.path
});
server.start();
