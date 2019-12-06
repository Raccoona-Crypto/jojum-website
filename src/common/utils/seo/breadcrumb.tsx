import React from 'react';
import Helmet from 'react-helmet';
import { useLocation } from 'react-router';
import { useI18n } from 'slim-i18n';
import { SEO_HOST } from './utils';

type BreadcrumbProps = {
    secondItem?: string;
};

const buildItem = (path: string, name: string, position: number) => {
    return {
        '@type': 'ListItem',
        position: position,
        item: {
            '@id': SEO_HOST + path,
            name: name,
        },
    };
};

// tslint:disable:no-http-string
export default React.memo(function Breadcrumbs({ secondItem }: BreadcrumbProps): JSX.Element {
    const i18n = useI18n();
    const location = useLocation();

    const listItem = [buildItem('/', i18n.gettext('Home'), 1)];
    if (secondItem) {
        listItem.push(buildItem(location.pathname, secondItem, 2));
    }

    const data = {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: listItem,
    };

    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(data)}</script>
        </Helmet>
    );
});
