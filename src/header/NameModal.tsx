import { createEffect, type Component } from 'solid-js';
import Modal from '../Modal';

const NameModal: Component<{ title: () => string, action: (name: string) => void, display: () => boolean, setDisplay: (display: boolean) => void }> = (props) => {
    let ref: HTMLInputElement;

    function saveAndClose() {
        props.action(ref.value);
        props.setDisplay(false);
    }

    function keyPressed(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            saveAndClose();
        }
    }

    createEffect(() => {
        ref.focus(({ focusVisible: props.display() } as FocusOptions));
    })

    return (
        <Modal title={props.title()} bodyClass='flex justify-between gap-3 py-4' display={props.display} setDisplay={props.setDisplay}>
            <input autofocus ref={ref!} placeholder='Profil namn' class='inverted' onKeyDown={keyPressed} />
            <a
                role='button'
                class='button contrast'
                onClick={saveAndClose} >
                Spara
            </a>
        </Modal>
    )
}

export default NameModal;