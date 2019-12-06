import * as H from 'history';
import React from 'react';
import {
    NavLink as RouterNavLink,
    NavLinkProps as RouterNavLinkProps,
    useRouteMatch,
} from 'react-router-dom';
import { generateUrl } from 'common/utils/url';

type LocalePathMatch = {
    locale?: string;
};

export type NavLinkProps = RouterNavLinkProps;

export default function NavLinkComponent(props: NavLinkProps): JSX.Element {
    const { to, title, ...otherProps } = props;
    const match = useRouteMatch<LocalePathMatch>();

    return (
        <RouterNavLink
            to={generateUrl(to as H.LocationDescriptor<any>, match.params.locale)}
            title={title || (typeof otherProps.children === 'string' ? otherProps.children : undefined)}
            {...otherProps}
        />
    );
};


