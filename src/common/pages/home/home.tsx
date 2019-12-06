import React from 'react';
import QRCode from 'qrcode.react';
import { Section } from 'common/components';

import styles from './home.scss';

const elements = [
    'Зараз буде останнє слово загадки. Думаю ти знаешь куди його запнути.',
    'walnut',
    'Усе що ти розгадав, введи до поля знизу',
    'Відскануй результат своїм улюбленим гаманцем і не перемикайся',
    'С днем нарождення!',
    'Чи тобі мало?',
    'Далі нічогісінько не буде...',
    'Стривай!',
    'А чому б нам не перетворити Jojum на пілотний проект з подарукам в критовалюті?',
    'Ось концепція, яку ти зараз використовуешь, буде реальним бізнес кейсом.',
    'Це охуенна ідея, MVP для якої вже існує. Ось воно, перед тобою! Влад і Я досить швидко все імплементували.',
    'Тому зараз ти бухаеш до посиніння, а завтра сідаємо і обговорюємо як тестувати гіпотезу! ',
    'З днем народження! Кінець.',
];

export default function Home(): JSX.Element {
    const [value, setValue] = React.useState('');
    const [step, setStep] = React.useState(-1);

    const totalSteps = elements.length;

    const onChangText = React.useCallback((event: any) => {
        setValue(event.target.value);
    }, []);

    const setNextStep = React.useCallback(() => {
        setStep(step + 1);
    }, [step]);

    return (
        <>
            <Section>
                <p>Привіт! Нарешті ти там де треба!</p>
                <p>Залишилось виконтати декілька степів і приз у тебе в кішені.</p>

                {step < 0 ? (
                    <div className={styles.interaction}>
                        <button onClick={setNextStep} className={styles.button}>Розпочати</button>
                    </div>
                ) : (
                    <div className={styles.interaction}>
                        <p className={styles.stepText}>
                            <b>Шаг {step + 1}</b> - <span>{elements[step]}</span>
                        </p>

                        {step + 1 >= totalSteps ? undefined : (
                            <button onClick={setNextStep} className={styles.button}>Наступний шаг</button>
                        )}
                    </div>
                )}

                {step > 1 ? (
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
