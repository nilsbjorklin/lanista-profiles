import { Accessor, type Component } from 'solid-js';
import Modal from '../Modal';

const EquipmentModal: Component<{
    title: string,
    equipment: Accessor<EquipmentForLevel | undefined>,
    display: () => boolean,
    setDisplay: (display: boolean) => void
}> = (props) => {
    return (
        <Modal title={props.title} display={props.display} setDisplay={props.setDisplay}>
            {JSON.stringify(props.equipment())}
        </Modal>
    )
}

export default EquipmentModal;