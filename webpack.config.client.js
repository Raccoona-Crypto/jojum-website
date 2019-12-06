const os = require('os');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const RequireFrom = require('webpack-require-from');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const Loaders = require('./webpack/loaders');

const isDev = process.env.NODE_ENV !== 'production';

function getEntry(name) {
    return name;
}

module.exports = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'source-map' : false,

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
        main: getEntry('client/main'),
    },

    output: {
        path: path.resolve(process.cwd(), 'dest/client'),
        publicPath: '/',
        filename: isDev ? '[name].js' : '[name].[hash:8].js',
        chunkFilename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
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

    performance: {
        hints: false,
    },

    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendors',
                    priority: 10,
                    enforce: true,
                },
            },
        },

        minimizer: [
            new UglifyJsPlugin({
                sourceMap: isDev,
                uglifyOptions: {
                    output: {
                        comments: false,
                    },
                },
                parallel: os.cpus().length,
            }),

            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {discardComments: {removeAll: true}},
            }),
        ],
    },

    plugins: getWebpackPlugins(),

    stats: {
        children: false,
        chunks: false,
    },
};

function getCSSLoader() {
    const loaders = Loaders.getBaseCssLoadersList();

    return {
        test: /(\.scss|\.css)$/,
        use: isDev ? ['style-loader', ...loaders] : [MiniCssExtractPlugin.loader, ...loaders],
    };
}

function getWebpackPlugins() {
    const plugins = [];

    if (!isDev) {
        plugins.push(
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:8].css'
            })
        );
    }

    plugins.push(
        new StatsWriterPlugin({
            filename: '../stats.json',
            transform(data) {
                const assetsByChunkName = data.assetsByChunkName;

                for (const key of Object.keys(assetsByChunkName)) {
                    if (Array.isArray(assetsByChunkName[key])) {
                        assetsByChunkName[key] = assetsByChunkName[key].filter((name) => !name.match(/\.map$/));
                    }
                }

                return JSON.stringify(assetsByChunkName, null, '    ');
            },
        })
    );

    plugins.push(
        new RequireFrom({
            methodName: '__getPublicPath',
            suppressErrors: true,
        })
    );

    plugins.push(
        new webpack.DefinePlugin({
            __isBrowser__: 'true',
        })
    );


    // In production we have different environment
    if (!isDev) {
        plugins.push(
            new CompressionPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$|\.svg$/,
                //   threshold: 10240,
                minRatio: 0.8,
            }),
        );
        plugins.push(
            new BrotliPlugin({
                asset: '[path].br[query]',
                test: /\.js$|\.css$|\.html$|\.svg$/,
                //   threshold: 10240,
                minRatio: 0.8,
            }),
        );

        plugins.push(
            new webpack.ContextReplacementPlugin(
                /validatorjs[/\\]src[/\\]lang$/,
                /en/
            )
        );
    }

    return plugins;
}
