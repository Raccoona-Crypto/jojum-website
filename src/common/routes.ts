import { ISitemapItemOptionsLoose } from 'sitemap';
import { ITranslationsAdapter } from 'slim-i18n';
import { RouteDescriptor, makeRoutePath, makeRouteLoadFunction } from 'common/utils/router';
import { PageSeoConfig } from 'common/utils/seo';

export const routes: RouteDescriptor[] = [
    {
        id: 'home',
        exact: true,
        rawPath: '/',
        path: makeRoutePath('/'),
        load: makeRouteLoadFunction('home'),
        getSeoConfig: (i18n: ITranslationsAdapter): PageSeoConfig => ({
            pageName: i18n.gettext('Home'),
            title: i18n.gettext('Всесвіт загадок'),
            description: i18n.gettext(
                'Ала не зовсім',
            ),
            canonicalLink: 'https://jojum.com',
            path: '/',
        }),
        getSitemapOption: (): ISitemapItemOptionsLoose => ({
            url: '/',
            priority: 1,
        }),
    },
    {
        id: 'no-match',
        path: makeRoutePath(''),
        load: makeRouteLoadFunction('no-match'),
        getSeoConfig: (i18n: ITranslationsAdapter): PageSeoConfig => ({
            title: i18n.gettext('Помилка 404'),
            description: i18n.gettext('Помилка 404. Сторінка не знайдена.'),
            path: '',
        }),
    },
];
