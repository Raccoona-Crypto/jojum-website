import React from 'react';
import cn from 'classnames';

import styles from './ui-button.scss';

export type UIButtonProps = {
    children: React.ReactNode;
    type?: 'button' | 'submit';
    mode?: 'contained' | 'outlined';
    color?: 'default' | 'primary';
    isSmall?: boolean;
    className?: string;
    disabled?: boolean;
    title?: string;
    onClick?: () => void;
    id?: string;
    // tslint:disable-next-line:no-any
    component?: React.ComponentType<any> | string;
    tabIndex?: number;
    autoFocus?: boolean;

    [key: string]: any;
};

export default function UIButton(props: UIButtonProps): JSX.Element {
    const {
        component = 'button',
        className,
        disabled,
        onClick,
        title,
        children,
        isSmall = false,
        color,
        mode,
        id,
        ...otherOptions
    } = props;

    const buttonClassName = React.useMemo(() => {
        return cn(
            styles.uiButton,
            getClassNames({ mode, color }),
            {
                [styles.isSmall]: isSmall,
            },
            className,
        );

    }, [mode, color, className, isSmall]);

    return React.createElement(
        component,
        {
            id: id,
            className: buttonClassName,
            disabled: disabled,
            title: title,
            onClick: onClick,
            ...otherOptions,
        },
        children,
    );
}

const getClassNames = ({ mode = 'contained', color = 'default' }: Partial<UIButtonProps>) => {
    const typeClassName = {
        contained: styles.iContained,
        outlined: styles.iOutlined,
    }[mode];

    const colorClassName = {
        default: styles.iDefault,
        primary: styles.iPrimary,
    }[color];

    return cn(typeClassName, colorClassName);
};
