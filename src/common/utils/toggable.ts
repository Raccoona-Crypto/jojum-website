import { withStateHandlers } from 'recompose';

export const toggable = withStateHandlers<ToggableState, ToggableHandlers, object>(
    { isOpen: false },
    {
        toggle: (state: ToggableState) => () => ({ isOpen: !state.isOpen }),
        setIsOpen: () => (isOpen: boolean) => ({ isOpen }),
    },
);

export type ToggableState = {
    isOpen: boolean;
};

export type ToggableHandlers = {
    toggle: () => ToggableState;
    setIsOpen: (isOpen: boolean) => ToggableState;
};
