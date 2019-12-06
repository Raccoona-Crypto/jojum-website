import React from 'react';
import styles from './join-link.scss';

type JoinLinkProps = {
    children?: React.ReactNode;
    className?: string;
    [key: string]: any;
};

export default React.memo(function JoinLink(props: JoinLinkProps) {
    const { children, className, ...elseProps } = props;

    return (
        <a {...elseProps} className={styles.link}>
            <span>{children}</span>
            <span className={styles.linkArrow}>→</span>
        </a>
    );
});
