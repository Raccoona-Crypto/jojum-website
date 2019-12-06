import { Request, Response } from 'express';

import I18N from 'common/i18n';
import { getActiveRoute, RouteDescriptor, getRouteLocale } from 'common/utils/router';
import { routes } from 'common/routes';
import App from 'common/app';
import logger from 'server/utils/logger';
import template from 'server/utils/template';
import { render, ServerRenderingContext } from 'server/utils/render';

import { setCache } from 'server/utils/memory-cache';
import { setHeaderLinks } from 'server/utils/set-seo-headers';

export default async function reactApplicationRender(req: Request, res: Response) {
    const { originalUrl: location } = req;
    try {
        logger.debug('React render');

        const activeRoute: RouteDescriptor | null = getActiveRoute(location, routes);
        if (activeRoute === null) {
            logger.error(`RouteDescriptor for: ${location} - not found`);
            return res.status(500).json({ message: `${location} not found` });
        }

        // handle i18n language init
        const i18nInstance = new I18N();
        const locale = getRouteLocale(location);
        await i18nInstance.setLanguage(locale);

        const context: ServerRenderingContext = {
            components: {},
            initialComponentProps: {},
        };

        const { markup, criticalCss } = await render({
            location: location,
            context: context,
            i18n: i18nInstance.getI18n(),
            AppComponent: App,
        });

        const html = template({
            criticalCss: criticalCss,
            markup: markup,
            chunks: ['vendors', 'main', activeRoute.id],
            initData: {
                initialComponentProps: context.initialComponentProps,
            },
        });

        const { statusCode = 200 } = context;
        if (statusCode !== 200) {
            logger.debug({ location, statusCode });
        }

        logger.debug(`Cache set: ${location}`);
        setCache(location, { html, statusCode });
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');

        if (activeRoute.rawPath !== undefined) {
            res.setHeader('Link', setHeaderLinks(activeRoute.rawPath, locale));
        }

        res.status(statusCode).write(html);
        res.end();
    } catch (err) {
        logger.error({ error: err.toString(), stack: err.stack, location });
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.status(500).write('<h1>Something wrong...</h1>');
        res.end();
    }
}
