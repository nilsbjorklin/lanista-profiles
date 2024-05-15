import { Index, createSignal, type Component } from 'solid-js';
import AttributeResultRow from './AttributeResultRow';
import AttributeRow from './AttributeRow';
import Row from './Row';
import TargetRow from './TargetRow';
import EquipmentModal from './EquipmentModal';

const ContentData: Component<{}> = () => {
    const [level, setLevel] = createSignal(1);
    const [display, setDisplay] = createSignal(false);
    const [equipment, setEquipment] = createSignal<EquipmentForLevel>();

    const openModal = (level: number, equipment: EquipmentForLevel | undefined) => {
        setLevel(level);
        setEquipment(equipment);
        setDisplay(true);
    }

    return (
        <div class='grid grid-flow-row auto-cols-fr overflow-y-scroll scrollbar-none sm:text-sm'>
            <EquipmentModal
                title={`Utrustning för Grad ${level()}`}
                equipment={equipment}
                display={display}
                setDisplay={setDisplay} />
            <Index each={Array(45)}>
                {(_item, index) => ([
                    <div class='border mt-2 rounded sm:border-x-0'>
                        <Row class='text-center font-bold p-3'>
                            <div>Grad {index + 1}</div>
                        </Row>
                        <AttributeRow index={index} />
                        <AttributeResultRow index={index} />
                        <TargetRow level={index + 1} openModal={openModal} />
                    </div>
                ])}
            </Index>
        </div>
    )
}

export default ContentData;