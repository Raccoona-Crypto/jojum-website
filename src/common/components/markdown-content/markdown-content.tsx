import React from 'react';
import cn from 'classnames';
import commonStyles from 'common/styles/common.scss';

const marked = require('marked');

type MDContentProps = {
    content: string;
    needTranspile?: boolean;
    className?: string | string[];
};

export default class MarkdownContent extends React.PureComponent<MDContentProps> {
    public state: any = {
        content: undefined,
    };

    public static defaultProps: Partial<MDContentProps> = {
        needTranspile: false,
    };

    public constructor(props: MDContentProps) {
        super(props);

        this.state.content = props.needTranspile ? marked(props.content) : props.content;
    }


    public componentDidUpdate(prevProps: Readonly<MDContentProps>): void {
        if (prevProps.content !== this.props.content) {
            const { content, needTranspile } = this.props;

            this.setState({
                content: needTranspile ? marked(content) : content,
            });
        }
    }


    public render(): JSX.Element {
        return (
            <div className={cn(commonStyles.markdown, this.props.className)}
                 dangerouslySetInnerHTML={{ __html: this.state.content }}
            />
        );
    }
}
