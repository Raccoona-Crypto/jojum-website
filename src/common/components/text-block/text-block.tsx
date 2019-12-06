import React from 'react';
import cn from 'classnames';
import style from './text-block.scss';

type TextBlockProps = {
    children?: React.ReactNode;
    className?: string;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p';
};

export default function TextBlock(props: TextBlockProps): JSX.Element {
    const { tag = 'p' } = props;

    return React.createElement(tag, {
        className: cn(style.text, props.className),
    }, props.children);
}
