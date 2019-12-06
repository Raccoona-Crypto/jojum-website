import React from 'react';
import Cookie from 'js-cookie';
import { compose } from 'recompose';
import { Location } from 'history';
import { TransitionGroup } from 'react-transition-group';
import { Switch, withRouter, Route, RouteComponentProps } from 'react-router';
import Head from 'common/utils/head';
import { routes } from 'common/routes';
import { joinUrlWithLocation, normalizeLocalePath } from 'common/utils/url';
import { styleTrigger } from 'common/utils/style-trigger';
import { getLocaleByShotCode } from 'common/utils/locale';
import { MatchProps, RouteDescriptor, isDefaultLocalePath, isAnyLocalePath } from 'common/utils/router';
import AsyncRoute from 'common/components/async-route';

import styles from './app.scss';

type AppProps = RouteComponentProps<MatchProps>;

class App extends React.Component<AppProps> {
    public componentDidMount(): void {
        this.__checkUserLocale();
    }

    public render(): JSX.Element {
        styleTrigger(styles);

        return (
            <TransitionGroup component={null}>
                <MainRouter {...this.props} />
            </TransitionGroup>
        );
    }

    private async __checkUserLocale(): Promise<void> {
        const { location, history } = this.props;

        if (isDefaultLocalePath(location)) {
            return history.replace([
                normalizeLocalePath(location.pathname),
                location.search,
                location.hash,
            ].join(''));
        }

        const isLocaleSetInPath = isAnyLocalePath(location);
        const userLocale = Cookie.get('user-locale');
        if (userLocale && !isLocaleSetInPath) {

            const { code } = getLocaleByShotCode(userLocale);
            const newPath = [
                joinUrlWithLocation(location.pathname, code),
                location.search,
                location.hash,
            ].join('');

            return history.replace(newPath);
        }
    }
}

export default compose<AppProps, {}>(withRouter)(App);

type MainRouterState = {
    location: Location;
};

class MainRouter extends React.Component<AppProps, MainRouterState> {
    public constructor(props: AppProps) {
        super(props);
        const routerLocation: Location = { ...props.history.location };

        this.state = {
            location: routerLocation,
        };
    }

    public componentWillReceiveProps(nextProps: AppProps): void {
        const { location: nextLocation } = nextProps;

        this.setState({ location: nextLocation });
    }

    public render(): JSX.Element {
        const location = this.state.location;
        return (
            <>
                <Switch location={location}>
                    {routes.map(({ id, path, exact, load, head, getSeoConfig }: RouteDescriptor) => (
                        <Route
                            key={id}
                            path={path}
                            exact={exact}
                            // tslint:disable-next-line:no-any
                            render={(props: RouteComponentProps<object, any>) => (
                                <>
                                    <Head getSeoConfig={getSeoConfig}>{head}</Head>
                                    <AsyncRoute {...props} loadComponent={load} id={id} />
                                </>
                            )}
                        />
                    ))}
                </Switch>
            </>
        );
    }
}
