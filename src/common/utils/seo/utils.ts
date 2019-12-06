export const SEO_HOST = 'https://plark.io';

export type PageSeoConfig = {
    title: string;
    description?: string;
    pageName?: string;
    robotsRule?: string;
    canonicalLink?: string;
    path?: string;
};

export type SitemapLink = {
    lang: string;
    url: string;
};
