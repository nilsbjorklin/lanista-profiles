import { type Component } from 'solid-js';

const RowLabel: Component<{ children: any, class?: string | undefined }> = (props) => {
    return (
        <div classList={{'col-span-2 p-3 text-center font-bold sm:border-none': true,  [props.class as string]: Boolean(props.class)}}>
            {props.children}
        </div>
    )
}


export default RowLabel;