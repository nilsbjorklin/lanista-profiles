import { Index, Match, Switch, createSignal, type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import AttributeResultRow from './AttributeResultRow';
import AttributeRow from './AttributeRow';
import EquipmentModal from './EquipmentModal';
import RowLabel from './RowLabel';
import TargetRow from './TargetRow';

const LevelHeader: Component<{
    level: number,
    openModal: (level: number, equipment: EquipmentForLevel | undefined) => void
}> = (props) => {
    const addTargetRow = useFields()?.target.addTargetForLevel as (level: number) => void;
    const usedStats = useFields()?.usedStats as () => Stat[];
    const equipment = useFields()?.equipment()?.[props.level];
    const target = useFields()?.target.values()?.[props.level];
    return (
        <div class='grid auto-cols-fr grid-flow-col p-3'>
            <RowLabel>Grad {props.level}</RowLabel>
            <div class='flex items-center justify-end gap-5 sm:gap-3' classList={{ 'col-span-5': usedStats().length === 5, 'col-span-6': usedStats().length === 6, 'col-span-7': usedStats().length === 7 }} >
                <Switch fallback={<a class='button contrast col-span-5' onclick={() => addTargetRow(props.level)}>Lägg till krav</a>}>
                    <Match when={target}>
                        <a class='button warning col-span-5' onclick={() => console.log('TODO')}>Ta bort krav</a>
                    </Match>
                </Switch>
                <a
                    role='button'
                    class='button contrast'
                    onclick={() => props.openModal(props.level, equipment)}>
                    Hantera utrustning
                </a>
            </div>
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
                    <div class='border mt-2 rounded sm:border-x-0'>
                        <LevelHeader level={index + 1} openModal={openModal} />
                        <AttributeRow index={index} />
                        <AttributeResultRow index={index} />
                        <TargetRow level={index + 1} openModal={openModal} />
                    </div>
                }
            </Index>
        </div>
    )
}

export default ContentData;