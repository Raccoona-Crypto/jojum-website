import React from 'react';
import { CSSTransition } from 'react-transition-group';

export type SpinnerProps = {
    in: boolean;
};

export type SpinnerState = {
    in: boolean;
};

export class Spinner extends React.Component<SpinnerProps, SpinnerState> {
    public state: SpinnerState = {
        in: false,
    };

    private _timeoutId: number = -1;

    public componentDidMount(): void {
        this._timeoutId = window.setTimeout(() => this.setState({ in: true }), 1000);
    }

    public componentWillUnmount(): void {
        window.clearTimeout(this._timeoutId);
    }

    public render(): React.ReactNode {
        return (
            <CSSTransition
                in={this.state.in && this.props.in}
                timeout={{ enter: 150, exit: 150 }}
                classNames="fade"
                mountOnEnter
                unmountOnExit
                appear
            >
                <div>Loading...</div>
            </CSSTransition>
        );
    }
}
