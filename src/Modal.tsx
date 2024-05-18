import { type Component } from 'solid-js';
import { Portal } from 'solid-js/web';

const Modal: Component<{ title: string, bodyClass?: string, fullsize?: boolean, children: any, display: () => boolean, setDisplay: (display: boolean) => void }> = (props) => {
    let ref: HTMLDivElement;

    function close() {
        props.setDisplay(false);
    }

    const checkIfClickedOutside = (event: MouseEvent) => {
        if (!ref.contains(event.target as Node)) {
            close();
        };
    }

    return (
        <Portal mount={document.getElementById("root") as Node}>
            <div hidden={!props.display()}
                id='modal'
                classList={{ 'p-0': props.fullsize, 'pt-16': !props.fullsize }}
                class='z-20 fixed top-0 left-0 w-screen h-screen bg-transparent-half'
                onClick={e => checkIfClickedOutside(e)}>
                <div class='flex justify-around w-screen h-screen'>
                    <div ref={ref!}
                        classList={{ 'border-x sm:border-none sm:w-screen h-screen': props.fullsize, 'border-2': !props.fullsize }}
                        class='flex flex-col justify-between gap-3 h-fit w-fit max-w-full max-h-full p-3 bg-dark'>
                        <div class='text-center'>
                            {props.title}
                        </div>
                        <div
                            classList={{ 'grow shrink': props.fullsize }}
                            class='overflow-y-scroll scrollbar-none border-y sm:grow sm:shrink'>
                            <div
                                class={props.bodyClass}>
                                {props.children}
                            </div>
                        </div>
                        <div class='text-right'>
                            <a
                                role='button'
                                class='inline-block button warning'
                                onClick={close} >
                                Stäng
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    )
}

export default Modal;