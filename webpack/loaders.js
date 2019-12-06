const path = require('path');
const autoprefixer = require('autoprefixer');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    getTSLoader() {
        return {
            test: /(\.tsx?)$/,
            use: [
                // 'cache-loader',
                {
                    loader: 'awesome-typescript-loader',
                    options: {
                        silent: true,
                    },
                },
            ],
        };
    },

    getBaseCssLoadersList() {
        return [
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    modules: true,
                    localIdentName: isDev ? '[name]__[local]--[hash:base64:6]' : '[hash:base64:8]',
                    camelCase: true,
                    importLoaders: 2,
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    plugins: [
                        autoprefixer({
                            grid: true,
                            overrideBrowserslist: ['> 1%', 'not ie < 11'],
                        }),
                    ],
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                    includePaths: [path.resolve(process.cwd(), 'src')],
                    outputStyle: 'expanded',
                },
            },
        ];
    },

    getSVGLoader() {
        return {
            test: /\.component\.svg$/,
            use: [
                'svg-react-loader',
                {
                    loader: 'svgo-loader',
                    options: {
                        floatPrecision: 3,
                        plugins: [
                            {
                                removeViewBox: false,
                                removeEmptyAttrs: true,
                            },
                        ],
                    },
                },
            ],
        };
    },

    getSVGIconsLoader() {
        return {
            test: /(?<!\.component)(?<!\.raw)\.svg$/,
            exclude: [path.resolve(process.cwd(), 'resources'), path.resolve(process.cwd(), 'src')],
            use: [
                'svg-sprite-loader',
                {
                    loader: 'svgo-loader',
                    options: {
                        floatPrecision: 3,
                        plugins: [{removeEmptyAttrs: true}],
                    },
                },
            ],
        };
    },

    getImgLoader() {
        return {
            test: /(?<!\.component)(?<!\.raw)\.(png|jpg|gif|svg)$/i,
            exclude: [path.resolve(process.cwd(), 'resources')],
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:8].[ext]',
                    },
                },
            ],
        };
    },

    getMDLoader() {
        return {
            test: /\.md$/,
            use: ['cache-loader', 'raw-loader', {loader: 'markdown-loader'}],
        };
    },

    getRawLoader() {
        return {
            test: /\.raw\.(png|jpg|gif|svg)$/i,
            use: ['raw-loader'],
        };
    },
};
