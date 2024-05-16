import { type Component } from 'solid-js';

const RowCell: Component<{ children: any, class?: string | undefined }> = (props) => {
    return (
        <div classList={{ 'p-3 text-center border-l sm:first:border-l-0 sm:border-t': true, [props.class as string]: Boolean(props.class) }}>
            {props.children}
        </div >
    )
}


export default RowCell;