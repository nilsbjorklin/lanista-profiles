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
        <input classList={{'input-no-button': true,  [props.class as string]: Boolean(props.class)}}
            type='number'
            value={props.value}
            onInput={props.onInput} />
    )
}


export default RowInput;
