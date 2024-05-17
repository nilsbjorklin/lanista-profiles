import { Index, createSignal, type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import AttributeResultRow from './AttributeResultRow';
import AttributeRow from './AttributeRow';
import EquipmentModal from './EquipmentModal';
import RowLabel from './RowLabel';
import TargetRow from './TargetRow';

const LevelRows: Component<{
    index: number,
    level: number,
    openModal: (level: number, equipment: EquipmentForLevel | undefined) => void
}> = (props) => {
    const addTargetRow = useFields()?.target.addTargetForLevel as (level: number) => void;
    const usedStats = useFields()?.usedStats as () => Stat[];
    const equipment = useFields()?.equipment()?.[props.level];
    const target = useFields()?.target.values()?.[props.level];

    return (
        <div class='border mt-2 rounded sm:border-x-0'>
            <div class='grid auto-cols-fr grid-flow-col p-3'>
                <RowLabel>Grad {props.level}</RowLabel>
                <div class='flex items-center justify-end gap-5 sm:gap-3' classList={{ 'col-span-5': usedStats().length === 5, 'col-span-6': usedStats().length === 6, 'col-span-7': usedStats().length === 7 }} >
                    {!target &&
                        <div class='button contrast col-span-5' onclick={() => addTargetRow(props.level)}>Lägg till krav</div>
                    }
                    <a
                        role='button'
                        class='button contrast'
                        onclick={() => props.openModal(props.level, equipment)}>
                        Hantera utrustning
                    </a>
                </div>
            </div>
            <AttributeRow index={props.index} />
            <AttributeResultRow index={props.index} />
            <TargetRow level={props.level} openModal={props.openModal} />
        </div>
    )
}

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
                {(_item, index) =>
                    <LevelRows index={index} level={index + 1} openModal={openModal} />
                }
            </Index>
        </div>
    )
}

export default ContentData;