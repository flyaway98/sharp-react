#!/usr/bin/env node
process.env.NODE_ENV = 'production';
const webpack = require('webpack');
const webpackConfig = require('../webpack/build');
const chalk = require('chalk');

webpack(webpackConfig, (err, stats) => {
    if (err) {
        console.log(chalk.red(err.stack || err));
        if (err.details) {
          console.log(chalk.red(err.details));
        }
        process.exit(1);
    }
    const info = stats.toJson();
    if (stats.hasErrors()) {
        process.stdout.write(chalk.red(info.errors));
        process.exit(1);
    }
    if (stats.hasWarnings()) {
       console.log(chalk.yellow(info.warnings));
    }
    console.log(chalk.green('Build complete'));
});
