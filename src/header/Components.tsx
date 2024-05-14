import { Match, Show, Switch, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { useLayout } from '../contexts/LayoutProvider';

export function HeaderButton(props: ChildButton) {
    return <a
        role='button'
        class='button'
        onClick={props.action ?? (() => { })}>
        {props.text}
    </a>
};

export function SelectableButton(props: ChildButton) {
    const [selected, setSelected] = createSignal(props.selected)
    const selectedStyle = 'button inverted';

    const toggleSelect = () => {
        setSelected(!selected());
        props.action?.();
    }

    return <a
        role='button'
        class={selected() ? selectedStyle : 'button'}
        onClick={toggleSelect}>
        {props.text}
    </a>
};

export type ChildButton = {
    selected?: boolean,
    text: string,
    action: (() => void) | undefined
}

export function Selector(props: { label?: any, children: ChildButton[], selectable?: boolean | undefined, text: string }) {
    const [show, setShow] = createSignal(false)
    let ref: HTMLDivElement;

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
        <div class='sm:max-w-[50%]'>
            <div ref={ref!} class='flex whitespace-nowrap overflow-hidden p-2 sm:px-2 select-none rounded-md border-2 border-transparent hover'>
                {props.label && <div class='font-bold pr-3'>{props.label}</div>}
                <a
                    role='button'
                    class='whitespace-nowrap overflow-hidden text-ellipsis'>
                    {props.text}
                </a>
                <i class='sm:ml-1 ml-2 text-[8px] flex items-center'>&#x25BC;</i>
            </div>
            <Show when={show()}>
                <div style={`min-width: ${size()}px`} class='drop-down'>
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
                <Selector text={props.collapsedText} selectable={props.selectable}>
                    {props.children}
                </Selector>
            </Match>
        </Switch>
    )
}

