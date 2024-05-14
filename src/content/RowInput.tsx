import { type Component } from 'solid-js';

const RowInput: Component<{
    value: number,
    class?: string | undefined,
    onInput: (e: InputEvent & {
        currentTarget: HTMLInputElement;
        target: HTMLInputElement;
    }) => void
}> = (props) => {
    return (
        <input class={`input-no-button ${props.class ?? ''}`}
            type='number'
            value={props.value}
            onInput={props.onInput} />
    )
}


export default RowInput;
