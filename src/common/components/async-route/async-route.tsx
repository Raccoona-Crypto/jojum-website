import React from 'react';
import { get } from 'lodash';
import { StaticContext } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { RouteProgress, Spinner } from 'common/components';

export type AsyncRouteStaticContext = StaticContext & {
    components: Record<string, Promise<React.ComponentType> | React.ComponentType | undefined>;
    initialComponentProps?: Record<string, any>;
};

export type AsyncRouteProps
    = RouteComponentProps<object, AsyncRouteStaticContext>
    & {
    id: string;
    loadComponent: () => Promise<React.ComponentType>;
};

type AsyncRouteState = {
    component: React.ComponentType | null;
    componentProps?: Record<string, any>;
};

export default class AsyncRoute extends React.Component<AsyncRouteProps> {
    public state: AsyncRouteState = {
        component: null,
        componentProps: {},
    };

    public UNSAFE_componentWillMount(): void {
        const { id } = this.props;
        this._handleData(id);
    }

    public render(): JSX.Element {
        const { component: Component } = this.state;

        return (
            <>
                <RouteProgress in={Component === null} />
                <Spinner in={Component === null} />
                {this._renderComponent()}
            </>
        );
    }

    private _renderComponent(): JSX.Element | undefined {
        const { component: Component, componentProps = {} } = this.state;
        const { loadComponent, ...props } = this.props;
        if (Component === null) {
            return undefined;
        }

        return (
            <CSSTransition in={Component !== null} timeout={{ enter: 150, exit: 150 }} classNames="fade">
                <Component {...props} {...componentProps} />
            </CSSTransition>
        );
    }

    private async _handleData(key: string): Promise<void> {
        const { staticContext, loadComponent } = this.props;

        if (__isBrowser__) {
            const components = get(window, '__initData.components');
            if (components[key]) {
                // Browser init load
                const component = components[key];
                const componentProps = get(window, `__initData.initialComponentProps[${key}]`, {});
                this.setState({ component, componentProps });

                components[key] = null;
            } else {
                // Navigate
                const component = await loadComponent();
                const componentProps = await this._fetchComponentInitialProps(component);
                this.setState({ component, componentProps });
            }
        } else {
            if (staticContext === undefined) {
                return;
            }

            const { components, initialComponentProps } = staticContext;
            const component = components[key];
            if (component) {
                // Server final render
                this.setState({ component, initialComponentProps });
            } else {
                // Server first render
                components[key] = loadComponent();
            }
        }
    }

    private async _fetchComponentInitialProps(component: any, data?: any) {
        if (component && component.hasOwnProperty('getInitialProps')) {
            return await component.getInitialProps({ isBrowser: true, req: data });
        }

        return {};
    }
}
