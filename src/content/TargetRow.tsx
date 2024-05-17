import { Index, Match, Switch, type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import { useLayout } from '../contexts/LayoutProvider';
import Row from './Row';
import RowCell from './RowCell';
import RowInput from './RowInput';
import RowLabel from './RowLabel';

const TargetRow: Component<{ level: number }> = (props) => {
    const usedStats = useFields()?.usedStats as () => Stat[];
    const modifiers = useFields()?.modifiers as () => { [key in Stat]?: number };
    const twoHanded = useFields()?.twoHanded as () => boolean;
    const setTarget = useFields()?.target.set as (level: number, stat: Stat, value: number) => void;
    const equipment = useFields()?.equipment()?.[props.level];
    const attributesTotal = useFields()?.attributes.total as () => Attributes;
    const target = useFields()?.target.values as () => Target;
    const targetEquipment = useFields()?.target.equipment as () => Target;

    function attribute(stat: Stat): number {
        return ((attributesTotal()[stat]?.[props.level - 1] ?? 0) * (modifiers()[stat] ?? 1));
    }

    function getTextForHeader(equipment: EquipmentForLevel | undefined, twoHanded: boolean) {
        let mainhand = equipment?.weapon?.mainhand?.name;
        let offhand = equipment?.weapon?.offhand?.name;

        if (twoHanded && mainhand) {
            return <span class='w-full'>Tvåhand: {mainhand}</span>;
        } else if (!twoHanded && (mainhand || offhand)) {
            return [<span class='w-1/2'>{mainhand ?? 'Ej vald'}</span>, <span class='w-1/2'>{offhand ?? 'Ej vald'}</span>]
        }
        return <span class='w-full'>Ingen utrustning vald</span>;
    }

    function targetIsReached(stat: Stat, value: number) {
        return attribute(stat) >= value;
    }

    return (
        <Switch>
            <Match when={target()[props.level] || targetEquipment()[props.level]}>
                <div>
                    <Row class='contrast'>
                        {useLayout()?.desktop() && <RowLabel>Kravtyp</RowLabel>}
                        <a classList={{ 'col-span-5': usedStats().length === 5, 'col-span-6': usedStats().length === 6, 'col-span-7': usedStats().length === 7 }}
                            class='select-none py-3 text-center font-bold border-l sm:border-l-0 font-mono flex'>
                            {getTextForHeader(equipment, twoHanded())}
                        </a>
                    </Row>
                    <Switch>
                        <Match when={target()[props.level]}>
                            <Row class='contrast border-t'>
                                <RowLabel>Egna</RowLabel>
                                <Index each={usedStats()}>
                                    {stat =>
                                        <RowInput
                                            value={target()?.[props.level]?.[stat()] ?? 0}
                                            class={targetIsReached(stat(), target()?.[props.level]?.[stat()] ?? 0) ? 'contrast' : 'warning'}
                                            onInput={(e) => setTarget(props.level, stat(), Number(e.target.value))} />
                                    }
                                </Index>
                            </Row>
                        </Match>
                    </Switch>
                    <Switch>
                        <Match when={targetEquipment()[props.level]}>
                            <Row class='contrast border-t'>
                                <RowLabel>Utrustning</RowLabel>
                                <Index each={usedStats()}>
                                    {stat =>
                                        <RowCell class={targetIsReached(stat(), targetEquipment()[props.level][stat()] ?? 0) ? '' : 'warning'}>
                                            {targetEquipment()[props.level][stat()] ?? 0}
                                        </RowCell>
                                    }
                                </Index>
                            </Row>
                        </Match>
                    </Switch>
                </div>
            </Match>
        </Switch>
    )
}

export default TargetRow;