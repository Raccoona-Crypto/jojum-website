const os = require('os');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Loaders = require('./webpack/loaders');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDev ? 'development' : 'production',
    devtool: false, // 'sourcemap',
    context: path.resolve(process.cwd(), 'src'),

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
        alias: {
            resources: path.resolve(process.cwd(), 'resources'),
            config: path.resolve(process.cwd(), 'config'),
        },
    },

    entry: {
        main: 'server/server',
    },

    target: 'node',

    externals: [
        nodeExternals({
            whitelist: [
                'slim-i18n',
                'normalize.css',
                'github-markdown-css',
                'idle-callback',
                /^isomorphic-styles/,
                'isomorphic-style-loader',
            ],
        }),
    ],

    output: {
        path: path.resolve(process.cwd(), 'dest/server'),
        filename: 'server.js',
        publicPath: '/',
    },

    module: {
        rules: [
            Loaders.getTSLoader(),
            getCSSLoader(),
            Loaders.getMDLoader(),
            Loaders.getSVGIconsLoader(),
            Loaders.getSVGLoader(),
            Loaders.getImgLoader(),
            Loaders.getRawLoader(),
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            __isBrowser__: 'false',
        }),
    ],

    optimization: {
        splitChunks: false,
        minimize: false,
    },

    stats: {
        children: false,
        chunks: false,
    },
};

function getCSSLoader() {
    const loaders = Loaders.getBaseCssLoadersList();

    return {
        test: /(\.scss|\.css)$/,
        use: ['isomorphic-styles/lib/loader/loader', ...loaders],
    };
}
