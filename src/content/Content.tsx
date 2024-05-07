import { type Component } from 'solid-js';

const Content: Component<{ children: any }> = (props) => {
    return (
        <div class='flex flex-col overflow-hidden' >
            {props.children}
        </div>
    )
}

export default Content;