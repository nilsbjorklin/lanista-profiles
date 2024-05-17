import { Index, createSignal, type Component } from 'solid-js';
import AttributeResultRow from './AttributeResultRow';
import AttributeRow from './AttributeRow';
import EquipmentModal from './EquipmentModal';
import LevelHeader from './LevelHeader';
import TargetRow from './TargetRow';

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
                level={level()}
                title={`Utrustning för Grad ${level()}`}
                equipment={equipment}
                display={display}
                setDisplay={setDisplay} />
            <Index each={Array(45)}>
                {(_item, index) =>
                    <div class='border mt-2 rounded sm:border-x-0'>
                        <LevelHeader level={index + 1} openModal={openModal} />
                        <AttributeRow index={index} />
                        <AttributeResultRow index={index} />
                        <TargetRow level={index + 1} />
                    </div>
                }
            </Index>
        </div>
    )
}

export default ContentData;