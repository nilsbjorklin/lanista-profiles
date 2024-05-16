import { type Component } from 'solid-js';
import { Portal } from 'solid-js/web';

const Modal: Component<{ title: string, bodyClass?: string, children: any, display: () => boolean, setDisplay: (display: boolean) => void }> = (props) => {
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
            <div hidden={!props.display()} id='modal' class='z-20 pt-16 fixed top-0 left-0 w-full h-full bg-transparent-half' onClick={e => checkIfClickedOutside(e)}>
                <div class='flex justify-around w-full h-full'>
                    <div ref={ref!} class='flex h-fit w-fit max-w-full border-2 p-3 flex-col gap-3 bg-dark'>
                        <div class='text-center'>{props.title}</div>
                        <hr />
                        <div class={props.bodyClass}>
                            {props.children}
                        </div>
                        <hr />
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