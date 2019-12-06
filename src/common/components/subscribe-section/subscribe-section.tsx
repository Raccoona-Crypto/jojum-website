import React from 'react';
import { useI18n } from 'slim-i18n';
import { __ } from 'common/i18n';
import { Section } from '../section';
import { Topic } from '../topic';
import styles from './subscribe-section.scss';
import SubscribeForm from './subscribe-form';

type SubscribeSectionProps = {};

const title = __('Stay in touch and maybe you’d like it.');
const content = __('Nobody loves newsletter spamming. Remember your last time you’ve opened these “best online crypto wallet” or “crypto currency wallet for you”. Catchy pictures and funny words — that’s what we like.');

export default function SubscribeSectionSection(_props: SubscribeSectionProps): JSX.Element {
    const i18n = useI18n();

    return (
        <Section className={styles.section} contentClassName={styles.sectionContent}>
            <Topic
                isSmall
                isCenter
                titleText={title(i18n)}
                descText={content(i18n)}
                titleClassName={styles.title}
                descClassName={styles.author}
            />

            <div className={styles.subscribeFormContainer}>
                <SubscribeForm />
            </div>
        </Section>
    );
}



