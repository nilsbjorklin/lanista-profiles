import { type Component } from 'solid-js';
import { useLayout } from '../LayoutProvider';

const Header: Component<{ children: any }> = (props) => {
    return (
        <div class={useLayout()?.textSize()}>
            <div class='flex flex-row flex-wrap sm:justify-between'>
                {props.children}
            </div>
        </div>
    )
}

export default Header;