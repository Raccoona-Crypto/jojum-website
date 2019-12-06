import { Request, Response } from 'express';
import moment from 'moment';
import { createSitemap, EnumChangefreq, ISitemapItemOptionsLoose } from 'sitemap';

import { routes } from 'common/routes';
import { SEO_HOST } from 'common/utils/seo';
import { CommonRouteDescriptor, getSitemapLinks } from 'common/utils/router';

export default async function dynamicSitemap(_req: Request, res: Response) {
    const sitemapUrlOptions: ISitemapItemOptionsLoose[] = [];

    const now = moment().format('YYYY-MM-DD');

    routes.forEach((route: CommonRouteDescriptor) => {
        if (!route.getSitemapOption) {
            return;
        }

        const { url, lastmod, changefreq, priority } = route.getSitemapOption();

        sitemapUrlOptions.push({
            url: url,
            priority: priority || 0.5,
            changefreq: changefreq || EnumChangefreq.MONTHLY,
            lastmod: lastmod || now,
            links: getSitemapLinks(url),
        });
    });

    const sitemap = createSitemap({
        hostname: SEO_HOST,
        urls: sitemapUrlOptions,
    });

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap.toString());
}