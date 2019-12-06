import 'babel-polyfill';

import { Location } from 'history';
import createBrowserHistory from 'history/createBrowserHistory';
import { requestIdleCallback } from 'idle-callback';
import { getActiveRoute, RouteDescriptor, getRouteLocale } from 'common/utils/router';
import { routes } from 'common/routes';
import App from 'common/app';
import I18N from 'common/i18n';

import { render } from './render';
import { actualizeStyleSheets } from './utils/style-sheets-actualizer';

(async () => {
    const currentHost = window.location.hostname;
    if (currentHost !== window.__initData.config.host) {
        return;
    }

    const currentPath = window.location.pathname;
    const activeRoute: RouteDescriptor | null = getActiveRoute(currentPath, routes);
    if (activeRoute === null) {
        console.error('Nothing match');
        return;
    }

    const rootElement = document.getElementById('app');

    window.__initData.components = {
        [activeRoute.id]: await activeRoute.load(),
    };

    // handle i18n language init
    const i18nInstance = new I18N();
    const locale = getRouteLocale(currentPath);
    await i18nInstance.setLanguage(locale);

    // handle navigation change language
    const history = createBrowserHistory();

    history.listen((location: Location) => {
        // TODO: Prevent navigation before language is loaded
        const nextLocale = getRouteLocale(location.pathname);
        i18nInstance.setLanguage(nextLocale);

        actualizeStyleSheets(location);
    });

    i18nInstance.onLanguageChanged(() => {
        requestIdleCallback(() =>
            render({
                rootElement: rootElement,
                history: history,
                i18n: i18nInstance.getI18n(),
                AppComponent: App,
            }),
        );
    });

    render({
        rootElement,
        history,
        i18n: i18nInstance.getI18n(),
        AppComponent: App,
    });
})();
