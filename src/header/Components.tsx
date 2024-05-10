import { Switch, Match, JSXElement } from 'solid-js';
import { useLayout } from '../contexts/LayoutProvider';

export function Button(props: { text?: string, action?: () => void, selected?: boolean }) {
    return (
        <Switch fallback={<HeaderButton text={props.text} action={props.action} />}>
            <Match when={props.selected}>
                <SelectedButton text={props.text} action={props.action} />
            </Match>
        </Switch>
    )
}

export function HeaderButton(props: { text?: string | undefined, action?: (() => void) | undefined }) {
    return <a
        class='select-none inline-block px-3 py-2 rounded-md border-2 border-transparent hover:border-light'
        onClick={props.action ?? (() => { })}>
        {props.text}
    </a>
};

export function SelectedButton(props: { text?: string | undefined, action?: (() => void) | undefined }) {
    return <a
        class='select-none inline-block px-3 py-2 rounded-md border-2 border-dark bg-light hover:border-light hover:text-light hover:bg-dark text-dark'
        onClick={props.action ?? (() => { })}>
        {props.text}
    </a>
};

export function Selector(props: { children: JSXElement, text: string, size: number }) {
    return (
        <div class='relative inline-block'>
            <Button text={props.text} />
            <div style={`min-width: ${props.size}px`} class='hidden shadow shadow-light p-1 sm:left-0 sm:right-0 absolute sm:fixed display-on-previous-hover bg-dark hover:block'>
                {props.children}
            </div>
        </div>
    )
};

export function Collapsable(props: { children: any, collapsedText: string }) {
    return (
        <Switch fallback={props.children}>
            <Match when={!useLayout()?.desktop()}>
                <Selector text={props.collapsedText} size={200}>
                    {props.children}
                </Selector>
            </Match>
        </Switch>
    )
}
