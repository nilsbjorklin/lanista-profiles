import { Match, Switch, createMemo, type Component } from 'solid-js';
import compareObjects from '../compareObjects';
import { useFields } from '../contexts/FieldsProvider';
import RowLabel from './RowLabel';

const LevelHeader: Component<{
    level: number,
    openModal: (level: number, equipment: EquipmentForLevel | undefined) => void
}> = (props) => {
    const addTargetRow = useFields()?.target.addTargetForLevel as (level: number) => void;
    const removeTargetRow = useFields()?.target.removeTargetForLevel as (level: number) => void;
    const usedStats = useFields()?.usedStats as () => Stat[];
    const equipment = createMemo(() => useFields()?.equipment()?.[props.level] as EquipmentForLevel, {}, { equals: (prev, next) => compareObjects(prev, next) });
    const target = createMemo(() => useFields()?.target.values()?.[props.level] as TargetForLevel, {}, { equals: (prev, next) => compareObjects(prev, next) });

    let buttonStyle = 'px-2 h-full select-none hover flex flex-col justify-center ';

    return (
        <div class='grid auto-cols-fr grid-flow-col'>
            <RowLabel>Grad {props.level}</RowLabel>
            <div class='flex justify-end' classList={{ 'col-span-5': usedStats().length === 5, 'col-span-6': usedStats().length === 6, 'col-span-7': usedStats().length === 7 }} >
                <Switch fallback={<a class={buttonStyle + 'text-blue'} onclick={() => addTargetRow(props.level)}>Lägg till krav</a>}>
                    <Match when={target()}>
                        <a class={buttonStyle + 'text-red'} onclick={() => removeTargetRow(props.level)}>Ta bort krav</a>
                    </Match>
                </Switch>
                <a
                    role='button'
                    class={buttonStyle + 'text-blue'}
                    onclick={() => props.openModal(props.level, equipment())}>
                    Hantera utrustning
                </a>
            </div>
        </div>
    )
}

export default LevelHeader;