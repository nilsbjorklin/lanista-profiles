import { createSignal, type Component } from 'solid-js';

const Modal: Component<{ title: string, action: (name: string) => void }> = (props) => {
    const [name, setName] = createSignal('');
    const [display, setDisplay] = createSignal('hidden');
    let ref: HTMLDivElement;

    function saveAndClose() {
        props.action(name());
        close();
    }

    function close() {
        setDisplay('hidden')
    }

    function keyPressed(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            saveAndClose();
        }
    }

    const checkIfClickedOutside = (event: MouseEvent) => {
        if (!ref.contains(event.target as Node)) {
            close();
        };
    }

    const ModalButton: Component<{ text: string, action: () => void }> = (props) => {
        return (
            <a
                class='text-right select-none inline-block px-3 py-1 rounded-md border-2 border-transparent border-light hover:bg-light hover:text-dark'
                onClick={props.action}>
                {props.text}
            </a>
        )
    }

    return (
        <div id='modal' class={`z-10 pt-16 top-0 left-0 w-full h-full bg-transparent-half flex justify-around ${display()}`} onClick={e => checkIfClickedOutside(e)}>
            <div ref={ref!} class='bg-dark flex w-fit h-fit rounded-xl border-2 border-light p-4 flex-col gap-6'>
                <div class='text-center'>{props.title}</div>
                <hr />
                <div class='flex justify-between gap-3'>
                    <input placeholder='Profil namn' class='text-dark' onKeyDown={keyPressed} onChange={(e) => setName(e.target.value)} />
                    <ModalButton text='Spara' action={saveAndClose} />
                </div>
                <hr />

                <div class='text-right'>
                    <ModalButton text='Stäng' action={close} />
                </div>
            </div>
        </div>
    )
}

export default Modal;