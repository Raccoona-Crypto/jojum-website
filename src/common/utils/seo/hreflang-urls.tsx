import React from 'react';
import { getLocales, DEFAULT_LOCALE, Locale } from '../locale';
import { SEO_HOST } from './utils';

export default (path: string) => getLocales().map((lc: Locale) => {
    const url = [
        SEO_HOST,
        DEFAULT_LOCALE === lc.code ? '' : '/' + lc.code,
        path,
    ];

    return <link key={lc.code} rel="alternate" href={url.join('')} hrefLang={lc.code} />;
});
