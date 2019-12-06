import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';

import { config } from 'server/config';
import { getChunkAssetFilePath, getCSSChunksMap, cssRe } from './assets-utils';
import GtmManager from './gtm';
import Favicon from './favicon';

export type TemplateData = Partial<{
    criticalCss: string;
    markup: string;
    chunks: string[];
    // tslint:disable-next-line:no-any
    initData: Record<string, any>;
}>;

const gtmManager = new GtmManager(config.get<string>('app.gtmKey'));

const clientConfig = getClientConfig();

function getLoadCSSScript(chunks: string[]): string {
    if (process.env.NODE_ENV !== 'production') {
        return '';
    }

    const chunksLoadCalls = chunks.map((chunk: string) => {
        try {
            return `loadCSS('${getChunkAssetFilePath(chunk, /\.css$/)}');`;
        } catch {
            return '';
        }
    });

    return `
        function loadCSS(src) {
            var headElement = document.getElementsByTagName('head')[0];
            var usedLaterCSS = document.createElement('link');
            usedLaterCSS.rel = 'stylesheet';
            usedLaterCSS.href = src;
            headElement.appendChild(usedLaterCSS);
        }
        setTimeout(function(){${chunksLoadCalls.join('\n')}}, 0);
    `;
}

function getPreloadLinks(chunks: string[]): JSX.Element | null {
    if (process.env.NODE_ENV !== 'production') {
        return null;
    }

    return (
        <>
            <link rel="preload"
                  href="/fonts/SF-Pro-Display-Regular.otf"
                  as="font"
                  type="font/woff2"
                  crossOrigin="anonymous"
            />
            <link as="font"
                  rel="preload"
                  href="/fonts/SF-Pro-Display-Medium.otf"
                  type="font/woff2"
                  crossOrigin="anonymous"
            />
            <link as="font"
                  rel="preload"
                  href="/fonts/SF-Pro-Display-Bold.otf"
                  type="font/woff2"
                  crossOrigin="anonymous"
            />
            {[...chunks].map((chunk: string) => {
                try {
                    const link = getChunkAssetFilePath(chunk, cssRe);

                    return <link
                        key={chunk + 'style'}
                        rel="preload"
                        href={link}
                        as="style"
                    />;
                } catch (error) {
                    return undefined;
                }
            })}
            {['runtime', ...chunks].map((chunk: string) => (
                <link key={chunk + 'script'} rel="preload" href={getChunkAssetFilePath(chunk)} as="script" />
            ))}
        </>
    );
}

function getClientConfig(): ClientConfig {
    return {
        host: config.get<string>('app.host'),
        isSecure: config.get<boolean>('app.secure'),
    };
}

export default function template(data: TemplateData): string {
    const { criticalCss = '', markup = '', chunks = [], initData = {} } = data;

    const configString = JSON.stringify({ config: clientConfig, ...initData });

    const initScript = `
        window.__initData = ${configString};
        window.__getPublicPath = function () {
            return window.__initData.publicPath || '/';
        };
        window.__cssChunksMap = ${JSON.stringify(getCSSChunksMap())}
    `;

    const helmet = Helmet.renderStatic();
    const htmlAttrs: any = helmet.htmlAttributes.toComponent();
    const bodyAttrs: any = helmet.bodyAttributes.toComponent();

    return (
        '<!DOCTYPE html>' +
        ReactDOMServer.renderToStaticMarkup(
            <html {...htmlAttrs}>
            <head>
                {helmet.title.toComponent()}
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <link rel="chrome-webstore-item"
                      href="https://chrome.google.com/webstore/detail/plark/jgboighcjegimmmjkclbniaddfakallg" />
                <meta name="apple-itunes-app" content="app-id=1455862890" />
                <Favicon />
                {getPreloadLinks(chunks)}
                {helmet.meta.toComponent()}
                {helmet.link.toComponent()}
                {helmet.script.toComponent()}
                {criticalCss && <style dangerouslySetInnerHTML={{ __html: criticalCss }} />}
            </head>
            <body {...bodyAttrs}>
            <div id="app" dangerouslySetInnerHTML={{ __html: markup }} />
            <script dangerouslySetInnerHTML={{ __html: initScript }} />
            <script src={getChunkAssetFilePath('runtime')} defer />
            {chunks.map((chunk: string) => (
                <script key={chunk} src={getChunkAssetFilePath(chunk)} defer />
            ))}
            <script dangerouslySetInnerHTML={{ __html: getLoadCSSScript([...chunks]) }} />
            {gtmManager.renderHead()}
            {gtmManager.renderBody()}
            </body>
            </html>,
        )
    );
}
