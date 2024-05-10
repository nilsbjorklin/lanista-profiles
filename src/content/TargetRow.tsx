import { Index, Match, Switch, type Component } from 'solid-js';
import { useLayout } from '../LayoutProvider';
import { EquipmentForLevel, Stat, TargetForLevel } from '../data/Types';
import Row from './Row';

const TargetRow: Component<{
    level: number,
    usedStats: () => Stat[],
    targetManual: TargetForLevel | undefined,
    targetEquipment: TargetForLevel | undefined,
    setTarget: (stat: Stat, value: number) => void,
    equipment: EquipmentForLevel | undefined,
    twoHanded: boolean
}> = (props) => {
    const labelStyle = 'col-span-2 p-3 text-center bg-blue text-light font-bold border-b';
    const bottomLabel = `${labelStyle} rounded-bl-md border-none`;
    const topLabel = `${labelStyle} rounded-tl-md`;
    const inputStyle = `input-no-button p-3 text-center bg-blue text-light border-l sm:first:border-l-0 sm:border-b`;
    const topInputStyle = `${inputStyle} border-b`;
    const headerStyle = 'py-3 px-10 text-center bg-blue text-light font-bold border-l border-b sm:border-l-0 font-mono flex';
    const headerStyle5 = `${headerStyle} col-span-5`;
    const headerStyle6 = `${headerStyle} col-span-6`;
    const headerStyle7 = `${headerStyle} col-span-7`;


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

    return (
        <Switch>
            <Match when={props.targetManual || props.targetEquipment}>
                <div class='border-x border-b rounded-b sm:border-none'>
                    <Row>
                        {useLayout()?.desktop() && <div class={topLabel}>Kravtyp</div>}
                        <a
                            class={props.usedStats().length === 7 ? headerStyle7 : (props.usedStats().length === 6 ? headerStyle6 : headerStyle5)}>
                            {getTextForHeader(props.equipment, props.twoHanded)}
                        </a>
                    </Row>
                    <Row>
                        <div class={props.targetEquipment ? labelStyle : bottomLabel}>Egna</div>
                        <Index each={props.usedStats()}>
                            {stat =>
                                <input class={props.targetEquipment ? topInputStyle : inputStyle}
                                    type='number'
                                    value={((props.targetManual as TargetForLevel)?.[stat()] ?? 0).toString()}
                                    onInput={e => props.setTarget(stat(), Number(e.target.value))} />
                            }
                        </Index>
                    </Row>
                    <Switch>
                        <Match when={props.targetEquipment}>
                            <Row>
                                <div class={labelStyle}>Utrustning</div>
                                <Index each={props.usedStats()}>
                                    {stat =>
                                        <div class={inputStyle}>
                                            {(props.targetEquipment as TargetForLevel)[stat() as Stat] ?? 0}
                                        </div>
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