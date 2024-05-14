import { type Component } from 'solid-js';

const RowCell: Component<{ value: string | number, class?: string | undefined }> = (props) => {
    return (
        <div class={`p-3 text-center border-l sm:first:border-l-0 sm:border-t ${props.class ?? ''}`}>
            {props.value}
        </div>
    )
}


export default RowCell;