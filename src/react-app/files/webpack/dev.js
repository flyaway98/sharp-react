const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const chainConfig = require('./base');

chainConfig.mode('development');
chainConfig.devtool('source-map');
const entry = chainConfig.entry('main').values();
entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
chainConfig.entry('main').clear().merge(entry);

chainConfig.module.rule('css').use('hotcss').loader('css-hot-loader').before('exactCss-loader');

chainConfig.plugin('defineEnv').use(webpack.DefinePlugin, [{
    'process.env.NODE_ENV': JSON.stringify('development')
}]).before('happyPack');
chainConfig.plugin('hot').use(HotModuleReplacementPlugin);
chainConfig.plugin('progress').use(WebpackBar);

module.exports = chainConfig.toConfig();
