import React from 'react';
import cn from 'classnames';

import styles from './section.scss';

export type TSectionProps = {
    children: React.ReactNode;
    className?: string | string[];
    contentClassName?: string;
    outerContent?: React.ReactNode;
    withLeftPadding?: boolean;
};

export function Section(props: TSectionProps) {

    const contentClass = cn(
        styles.sectionContent,
        props.contentClassName,
        props.withLeftPadding && styles.iLeftPadding
    );

    return (
        <section className={cn(styles.section, props.className)}>
            {props.outerContent}
            <div className={contentClass}>
                {props.children}
            </div>
        </section>
    );
};
