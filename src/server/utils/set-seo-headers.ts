import { SEO_HOST } from 'common/utils/seo';
import { getLocales, Locale } from 'common/utils/locale';

export function setHeaderLinks(path: string, currentLocale: string): string[] | string {
    const linksData: string[] = [];
    linksData.push(`<${SEO_HOST}/${currentLocale}${path}>; rel="canonical",`);

    getLocales().map((locale: Locale) => {
        if (locale.code !== currentLocale) {
            linksData.push(`<${SEO_HOST}/${locale.code}${path}>; rel="alternate"; hreflang="${locale.shortCode}"`);
        }
    });

    return linksData;
}
