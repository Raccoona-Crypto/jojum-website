import React from 'react';
import QRCode from 'qrcode.react';
import { Section } from 'common/components';

import styles from './home.scss';

export default function Home(): JSX.Element {
    const [value, setValue] = React.useState('');
    const [step, setStep] = React.useState(-1);

    const onChangText = React.useCallback((event: any) => {
        setValue(event.target.value);
    }, []);

    const setNextStep = React.useCallback(() => {
        setStep(step + 1);
    }, [step]);

    return (
        <>
            <Section>
                {step < 0 ? (
                    <>
                        <p>Привіт, Владику!</p>
                        <p>Тобі 26 рочків, і ти вже знаешь що робити:</p>

                        {step < 0 ? (
                            <div className={styles.interaction}>
                                <button onClick={setNextStep} className={styles.button}>Показати те що сховано</button>
                            </div>
                        ) : undefined}
                    </>
                ) : undefined}


                {step >= 0 ? (
                    <div>
                        <textarea onChange={onChangText} placeholder="Відповідь сюди" className={styles.textarea}>
                            {value}
                        </textarea>
                    </div>
                ) : undefined}

                <div>
                    {value.length ? (
                        <QRCode value={value.replace(/\s/g, ' ').trim()}
                                size={250}
                                bgColor="#EEF1F5"
                        />
                    ) : undefined}
                </div>
            </Section>
        </>
    );
}
