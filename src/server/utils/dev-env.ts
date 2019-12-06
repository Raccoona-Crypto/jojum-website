import { Express } from 'express';

import * as WebpackModule from 'webpack';
import * as DevMiddlewareModule from 'webpack-dev-middleware';

export function applyDevEnv(expressApp: Express): void {
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    const webpack: typeof WebpackModule = require('webpack');
    const devMiddleware: typeof DevMiddlewareModule = require('webpack-dev-middleware');
    const webpackConfig = require('../../../webpack.config.client');

    const compiler = webpack(webpackConfig);
    const progressPlugin = new webpack.ProgressPlugin();
    progressPlugin.apply(compiler);
    const devMiddlewareInstance = devMiddleware(compiler, {
        serverSideRender: true,
        stats: 'errors-only',
        logLevel: 'error',
        publicPath: '/',
    });
    expressApp.use(devMiddlewareInstance);
}
