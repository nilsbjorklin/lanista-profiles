import type { Component } from 'solid-js';

const HeaderButton: Component<{buttonText: string}> = (props) => {
    return <button class='px-3 py-3 hover:bg-gray-800 hover:text-white text-gray-800 rounded-b-lg'>{props.buttonText}</button>
};

export default HeaderButton;