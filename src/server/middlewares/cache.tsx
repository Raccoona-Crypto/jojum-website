import { Request, Response } from 'express';

import logger from 'server/utils/logger';
import { getCache } from 'server/utils/memory-cache';
import { setHeaderLinks } from 'server/utils/set-seo-headers';
import { getActiveRoute, getRouteLocale, RouteDescriptor } from 'common/utils/router';
import { routes } from 'common/routes';

export default async function cacheMiddleware(req: Request, res: Response, next: () => void): Promise<void> {
    const { originalUrl: location } = req;

    const data = getCache(location);
    if (data === null) {
        logger.debug(`Cache miss: ${location}`);
        return next();
    }

    const { html, statusCode } = data;
    logger.debug(`Cache hit: ${location}`);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');

    const activeRoute: RouteDescriptor | null = getActiveRoute(location, routes);
    const locale = getRouteLocale(location);

    if (activeRoute !== null && activeRoute.rawPath !== undefined) {
        res.setHeader('Link', setHeaderLinks(activeRoute.rawPath, locale));
    }

    res.status(statusCode).write(html);
    res.end();
}
