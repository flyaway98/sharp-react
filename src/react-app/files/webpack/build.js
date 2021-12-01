const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const cssNano = require('cssnano');
const chainConfig = require('./base');
const outputFileName = `${chainConfig.output.get('filename')}`.replace('.js', '-[chunkhash:10].js');

chainConfig.output.filename(outputFileName);

chainConfig.module.rule('img').use('url-loader').tap(option => {
    const { name } = option;
    option.name = name.replace('.[ext]', '-[hash:10].[ext]');
    return option;
});

chainConfig.module.rule('font-icon').use('url-loader').tap(option => {
    const { name } = option;
    option.name = name.replace('.[ext]', '-[hash:10].[ext]');
    return option;
});


chainConfig.plugin('defineEnv').use(webpack.DefinePlugin, [{
    'process.env.NODE_ENV': JSON.stringify('production')
}]).before('happyPack');

chainConfig.plugin('exactCss').tap(args => {
    const { filename } = args[0];
    args[0].filename = filename.replace('.css', '-[contenthash:10].css');
    return args;
});

chainConfig.plugin('clean').use(CleanWebpackPlugin);
chainConfig.plugin('report').use(BundleAnalyzerPlugin);


chainConfig.optimization
    .splitChunks({
        cacheGroups: {
            libs: {
                test: module => {
                    if (!module.context.includes('node_modules')) return false;
                    return module.type === 'javascript/auto';
                },
                name: 'libs',
                minSize: 20000,
                minChunks: 2,
                priority: 10,
                chunks: 'initial'
            },
            commons: {
                test: module => {
                    if (module.context.includes('node_modules')) return false;
                    return module.type === 'javascript/auto';
                },
                name: 'common',
                minChunks: 3,
                priority: 5,
                chunks: 'initial'
            }
        }
    })
    .runtimeChunk({
        name: 'manifest'
    });
const config = chainConfig.toConfig();
config.optimization.minimizer = [
    new CssMinimizerPlugin()
]
module.exports = config;
