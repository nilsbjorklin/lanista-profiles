import { Index, Match, Switch, type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import { useLayout } from '../contexts/LayoutProvider';
import { Attributes, EquipmentForLevel, Stat, Target, TargetForLevel } from '../data/Types';
import Row from './Row';

const TargetRow: Component<{ level: number }> = (props) => {
    const usedStats = useFields()?.usedStats as () => Stat[];
    const modifiers = useFields()?.modifiers as () => { [key in Stat]?: number };
    const twoHanded = useFields()?.twoHanded as () => boolean;
    const setTarget = useFields()?.target.set as (level: number, stat: Stat, value: number) => void;
    const equipment = useFields()?.equipment()?.[props.level];
    const attributesTotal = useFields()?.attributes.total as () => Attributes;
    const target = useFields()?.target.values as () => Target;
    const targetEquipment = useFields()?.target.equipment as () => Target;

    const labelStyle = 'col-span-2 p-3 text-center bg-blue text-light font-bold border-b';
    const bottomLabel = `${labelStyle} rounded-bl-md border-none`;
    const topLabel = `${labelStyle} rounded-tl-md`;
    const inputStyle = `input-no-button p-3 text-center bg-blue text-light border-l sm:first:border-l-0 sm:border-b`;
    const topInputStyle = `${inputStyle} border-b`;
    const headerStyle = 'py-3 px-10 text-center bg-blue text-light font-bold border-l border-b sm:border-l-0 font-mono flex';
    const headerStyle5 = `${headerStyle} col-span-5`;
    const headerStyle6 = `${headerStyle} col-span-6`;
    const headerStyle7 = `${headerStyle} col-span-7`;

    function attribute(stat: Stat): number {
        return ((attributesTotal()[stat]?.[props.level - 1] ?? 0) * (modifiers()[stat] ?? 1));
    }

    function getTextForHeader(equipment: EquipmentForLevel | undefined, twoHanded: boolean) {
        let mainhand = equipment?.weapon?.mainhand?.name;
        let offhand = equipment?.weapon?.offhand?.name;

        if (twoHanded && mainhand) {
            return <p class='w-full'>Tvåhand: {mainhand}</p>;
        } else if (!twoHanded && (mainhand || offhand)) {
            return [<p class='w-1/2'>{mainhand ?? 'Ej vald'}</p>, <p class='w-1/2'>{offhand ?? 'Ej vald'}</p>]
        }
        return <p class='w-full'>Välj utrustning</p>;
    }

    function getTargetStyle(isMiddleElement: boolean, stat: Stat, value: number) {
        let style = isMiddleElement ? topInputStyle : inputStyle;
        return attribute(stat) < value ? style.replace('bg-blue', 'bg-red') : style;
    }

    const ManualValue: Component<{ stat: Stat, last: boolean, value: number, action: (e: any) => void }> = (props) => {
        return (
            <input class={getTargetStyle(props.last, props.stat, props.value)}
                type='number'
                value={props.value}
                onInput={props.action} />
        )
    }

    const EquipmentValue: Component<{ stat: Stat, value: number }> = (props) => {
        return (
            <div class={getTargetStyle(false, props.stat, props.value)}>
                {props.value}
            </div>
        )
    }

    return (
        <Switch>
            <Match when={target()[props.level] || targetEquipment()[props.level]}>
                <div class='border-x border-b rounded-b sm:border-none'>
                    <Row>
                        {useLayout()?.desktop() && <div class={topLabel}>Kravtyp</div>}
                        <a
                            class={usedStats().length === 7 ? headerStyle7 : (usedStats().length === 6 ? headerStyle6 : headerStyle5)}>
                            {getTextForHeader(equipment, twoHanded())}
                        </a>
                    </Row>
                    <Row>
                        <div class={targetEquipment()[props.level] ? labelStyle : bottomLabel}>Egna</div>
                        <Index each={usedStats()}>
                            {stat =>
                                <ManualValue
                                    stat={stat()}
                                    last={Boolean(targetEquipment()[props.level])} value={((target()[props.level] as TargetForLevel)?.[stat()] ?? 0)}
                                    action={e => setTarget(props.level, stat(), Number(e.target.value))} />
                            }
                        </Index>
                    </Row>
                    <Switch>
                        <Match when={targetEquipment()[props.level]}>
                            <Row>
                                <div class={bottomLabel}>Utrustning</div>
                                <Index each={usedStats()}>
                                    {stat =>
                                        <EquipmentValue
                                            stat={stat()}
                                            value={targetEquipment()[props.level][stat()] ?? 0} />
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