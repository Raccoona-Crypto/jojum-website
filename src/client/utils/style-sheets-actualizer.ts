import { Location } from 'history';

import { routes } from 'common/routes';
import { getActiveRoute, RouteDescriptor } from 'common/utils/router';
import { baseHost } from 'common/utils/url';

export function actualizeStyleSheets(location: Location): void {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }

    const currentPath = location.pathname;
    const activeRoute: RouteDescriptor | null = getActiveRoute(currentPath, routes);
    if (activeRoute === null) {
        console.error('Nothing match');
        return;
    }

    const cssChunksMap = window.__cssChunksMap;
    const chunkAssets = [...cssChunksMap.vendors, ...cssChunksMap.main, ...cssChunksMap[activeRoute.id]];
    for (const styleSheet of Array.from(document.styleSheets)) {
        const { href } = styleSheet;
        if (href === null || !href.match(baseHost)) {
            continue;
        }

        if (chunkAssets.some((asset: string) => Boolean(href.match(asset)))) {
            styleSheet.disabled = false;
            continue;
        }

        styleSheet.disabled = true;
    }
}
