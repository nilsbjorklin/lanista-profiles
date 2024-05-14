import { Match, Switch, type Component } from 'solid-js';
import { useLayout } from '../contexts/LayoutProvider';

const Row: Component<{ children: any[] | any, class?: string }> = (props) => {
    return (
        <Switch fallback={<InternalRow class={props.class}>{props.children}</InternalRow>}>
            <Match when={props.children instanceof Array}>
                <Switch fallback={<InternalRow class={props.class}>{props.children}</InternalRow>}>
                    <Match when={!useLayout()?.desktop()}>
                        <div class={props.class}>
                            <InternalRow>
                                {(props.children as any[])[0]}
                            </InternalRow>
                            <InternalRow>
                                {(props.children as any[]).slice(1)}
                            </InternalRow>
                        </div>
                    </Match>
                </Switch>
            </Match>
        </Switch>
    )
}

const InternalRow: Component<{ children: any[], class?: string | undefined }> = (props) => {
    return (
        <div class={`grid auto-cols-fr grid-flow-col ${props.class ?? ''}`}>
            {props.children}
        </div>
    )
}


export default Row;