import { Match, Show, Switch, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { useLayout } from '../contexts/LayoutProvider';

const buttonStyle = 'select-none inline-block px-3 py-2 rounded-md border-2 border-transparent hover:border-light';

export function HeaderButton(props: ChildButton) {
    return <a
        class={buttonStyle}
        onClick={props.action ?? (() => { })}>
        {props.text}
    </a>
};

export function SelectableButton(props: ChildButton) {
    const [selected, setSelected] = createSignal(props.selected)
    const selectedStyle = 'select-none inline-block px-3 py-2 rounded-md border-2 border-dark bg-light hover:border-light hover:text-light hover:bg-dark text-dark';

    const toggleSelect = () => {
        setSelected(!selected());
        props.action?.();
    }

    return <a
        class={selected() ? selectedStyle : buttonStyle}
        onClick={toggleSelect}>
        {props.text}
    </a>
};

export type ChildButton = {
    selected?: boolean,
    text: string,
    action: (() => void) | undefined
}

export function Selector(props: { children: ChildButton[], selectable?: boolean, text: string }) {
    const [show, setShow] = createSignal(false)
    let ref: HTMLAnchorElement;

    const calculateSize = () => {
        const charWidth = 9;
        const paddingWith = 25;
        return (props.children.reduce((a, b) => a > b.text.length ? a : b.text.length, 0) * charWidth) + paddingWith
    }

    const size = createMemo(() => calculateSize());

    const handleClick = (event: MouseEvent) => {
        if (!ref.contains(event.target as Node)) {
            setShow(false);
        } else {
            setShow((isShown) => !isShown)
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClick);
    });

    onCleanup(() => {
        document.removeEventListener('click', handleClick);
    });

    return (
        <div class='relative inline-block sm:overflow-hidden sm:whitespace-nowrap'>
            <a ref={ref!}
                class={buttonStyle}>
                {props.text}
            </a>
            <Show when={show()}>
                <div style={`min-width: ${size()}px`} class='shadow shadow-light p-1 sm:left-0 sm:right-0 absolute sm:fixed bg-dark grid grid-cols-1'>
                    {mapChildButtons(props.children, props.selectable)}
                </div>
            </Show>
        </div>
    )
};

function mapChildButtons(children: ChildButton[], selectable?: boolean) {
    let elements;
    if (selectable)
        elements = children.map(child => SelectableButton(child))
    else
        elements = children.map(child => HeaderButton(child))
    return elements;
}

export const Collapsable = (props: { children: ChildButton[], selectable?: boolean, collapsedText: string }) => {
    return (
        <Switch fallback={mapChildButtons([...props.children], props.selectable)}>
            <Match when={!useLayout()?.desktop()}>
                <Selector text={props.collapsedText}>
                    {props.children}
                </Selector>
            </Match>
        </Switch>
    )
}

