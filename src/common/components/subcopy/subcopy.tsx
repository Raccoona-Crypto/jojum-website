import React from 'react';
import styles from './subcopy.scss';

type SubcopyProps = {
    texts: {
        title?: string;
        titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
        content: string;
    }[];
};

export default React.memo(function Subcopy(props: SubcopyProps): JSX.Element {
    const { texts } = props;

    return (
        <div className={styles.subcopyWrapper}>
            {texts.map((item: any, i: number) => {
                return (
                    <article key={i} className={styles.subcopy}>
                        {item.title ? (
                            <>
                                {React.createElement(
                                    item.titleTag || 'h4',
                                    {
                                        className: styles.subcopyTitle,
                                    },
                                    item.title,
                                )}{' '}
                            </>
                        ) : (
                            undefined
                        )}

                        <p className={styles.subcopyContent}>{item.content}</p>
                    </article>
                );
            })}
        </div>
    );
});
