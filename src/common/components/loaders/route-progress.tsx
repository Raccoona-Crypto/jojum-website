import React from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './route-progress.scss';

export type LoaderProps = { in: boolean };
export type LoaderState = typeof initState;
const initState = {
    width: 0,
};

const enum Constants {
    Threshold = 70,
    Interval = 300,
}

export class RouteProgress extends React.Component<LoaderProps, LoaderState> {
    public state: LoaderState = initState;

    private _intervalId: number = -1;

    public componentWillUnmount(): void {
        this._stopProgress();
    }

    public render(): React.ReactNode {
        return (
            <CSSTransition
                in={this.props.in}
                timeout={{ enter: 300, exit: 600 }}
                classNames="route-progress"
                onEnter={this._onEnter}
                onEntering={this._onEntering}
                onExit={this._onExit}
                mountOnEnter
                unmountOnExit
                appear
            >
                <div className={styles.routeProgress} style={{ width: `${this.state.width}vw` }} />
            </CSSTransition>
        );
    }

    private _startProgress(): void {
        this._intervalId = window.setInterval(() => {
            const { width } = this.state;
            const step = (Constants.Threshold - width) / 10;
            this.setState({ width: width + step });
        }, Constants.Interval);
    }

    private _stopProgress(): void {
        window.clearInterval(this._intervalId);
    }

    private _onEnter = () => this._startProgress();

    private _onEntering = () => this.setState({ width: 30 });

    private _onExit = () => {
        this.setState({ width: 100 });
        this._stopProgress();
    };
}
