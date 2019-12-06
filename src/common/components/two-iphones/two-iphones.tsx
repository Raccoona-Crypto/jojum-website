import React from 'react';
import cn from 'classnames';
import styles from './two-iphones.scss';

type TwoIPhonesProps = {
    className?: string;
};

export default React.memo(function TwoIPhones(props: TwoIPhonesProps) {
    return (
        <div className={cn(styles.phones, props.className)}>
            <img src="/img/trade-screen.png" className={styles.phonesScene} alt="Trade Screen" />
            <img
                src="/img/trade-confirmation-screen.png"
                className={styles.phonesScene}
                alt="Trade Confirmation Screen"
            />
        </div>
    );
});
