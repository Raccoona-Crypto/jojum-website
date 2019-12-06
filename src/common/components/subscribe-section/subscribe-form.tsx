import React, { ChangeEvent, FormEvent } from 'react';
import Axios from 'axios';
import { compose } from 'recompose';
import { withTranslations, WithTranslationsProps } from 'slim-i18n';
import UIButton from '../ui-button';

import styles from './subscribe-section.scss';

class SubscribeForm extends React.PureComponent<WithTranslationsProps> {
    public state: any = {
        email: '',
        loading: false,
        errorMessage: '',
        success: false,
    };

    public render(): JSX.Element {
        const { i18n } = this.props;
        const { loading, errorMessage, success } = this.state;

        if (success) {
            return (
                <div className={styles.subscribeSuccess}>
                    {i18n.gettext('You subscribed successfully to our newsletter.')}
                </div>
            );
        }

        return (
            <form onSubmit={this._handleFormSubmit} className={styles.subscribe}>
                <div className={styles.subscribeForm}>
                    <input
                        value={this.state.email}
                        onChange={this._handleValue}
                        className={styles.subscribeInput}
                        placeholder="enter your email"
                    />

                    <UIButton color="primary" disabled={loading} className={styles.subscribeButton}>
                        {loading ? 'Loading...' : i18n.gettext('Subscribe')}
                    </UIButton>
                </div>

                <div className={styles.subscribeErrorMessage}>{errorMessage}</div>
            </form>
        );
    }

    private _handleValue = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: e.target.value });
    };

    private _handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (this.state.loading) {
            return;
        }

        this.setState({ loading: true, errorMessage: '' });

        if (!this.state.email || this.state.email.length < 4) {
            this.setState({
                loading: false,
                errorMessage: 'Provide valid email',
            });

            return;
        }

        const requestData = {
            email: this.state.email,
        };

        try {
            await Axios.post('/api/email-subscribe', requestData, { timeout: 5000 });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: 'Provide valid email' });
        } finally {
            this.setState({ loading: false });
        }
    };
}

export default compose<WithTranslationsProps, any>(withTranslations)(SubscribeForm);
