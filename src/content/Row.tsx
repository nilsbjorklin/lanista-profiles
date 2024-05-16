import { Match, Switch, type Component } from 'solid-js';
import { useLayout } from '../contexts/LayoutProvider';

const Row: Component<{ children: any[] | any, class?: string, onClick?: (() => void) | undefined }> = (props) => {

    return (
        <Switch fallback={<InternalRow class={props.class} onClick={props.onClick}>{props.children}</InternalRow>}>
            <Match when={props.children instanceof Array}>
                <Switch fallback={<InternalRow class={props.class} onClick={props.onClick}>{props.children}</InternalRow>}>
                    <Match when={!useLayout()?.desktop()}>
                        <div
                            classList={{[props.class as string]: Boolean(props.class), 'hover': Boolean(props.onClick) }}>
                            <div
                                class='grid auto-cols-fr grid-flow-col'>
                                {(props.children as any[])[0]}
                            </div>
                            <div
                                class='grid auto-cols-fr grid-flow-col'>
                                {(props.children as any[]).slice(1)}
                            </div>
                        </div>
                    </Match>
                </Switch>
            </Match>
        </Switch>
    )
}

const InternalRow: Component<{ children: any[], class?: string | undefined, onClick?: (() => void) | undefined }> = (props) => {
    return (
        <div
            onClick={() => props?.onClick?.()}
            classList={{ 'grid auto-cols-fr grid-flow-col': true, [props.class as string]: Boolean(props.class), 'hover': Boolean(props.onClick) }}>
            {props.children}
        </div>
    )
}


export default Row;