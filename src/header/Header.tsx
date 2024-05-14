import { type Component } from 'solid-js';
import { useLayout } from '../contexts/LayoutProvider';

const Header: Component<{ children: any }> = (props) => {
    return (
        <header class={useLayout()?.textSize()}>
            <div class='flex flex-row flex-wrap sm:justify-between'>
                {props.children}
            </div>
        </header>
    )
}

export default Header;