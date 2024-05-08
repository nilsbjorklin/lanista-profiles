import { Index, Match, Switch, type Component } from 'solid-js';
import { useLayout } from '../LayoutProvider';
import { EquipmentForLevel, Stat, TargetForLevel } from '../data/Types';
import Row from './Row';

const TargetRow: Component<{
    level: number,
    usedStats: () => Stat[],
    targetManual: TargetForLevel | undefined,
    targetEquipment: TargetForLevel | undefined,
    targetTotal: TargetForLevel | undefined,
    setTarget: (stat: Stat, value: number) => void,
    equipment: EquipmentForLevel | undefined
}> = (props) => {
    const labelStyle = 'col-span-2 p-3 text-center bg-blue text-light font-bold border-b';
    const bottomLabel = `${labelStyle} rounded-bl-md border-none`;
    const topLabel = `${labelStyle} rounded-tl-md`;
    const inputStyle = `input-no-button p-3 text-center bg-blue text-light border-l sm:first:border-l-0 sm:border-b`;
    const topInputStyle = `${inputStyle} border-b`;

    return (
        <Switch>
            <Match when={props.targetManual || props.targetEquipment}>
                <div class='border-x border-b rounded-b sm:border-none'>
                    <Row>
                        {useLayout()?.desktop() && <div class={topLabel}>Kravtyp</div>}
                        <div class={`col-span-${props.usedStats().length} p-3 text-center bg-blue text-light font-bold border-l border-b sm:border-l-0`}>Krav för Grad {props.level}</div>
                    </Row>
                    <Row>
                        <div class={props.targetEquipment ? labelStyle : bottomLabel}>Egna</div>
                        <Index each={props.usedStats()}>
                            {stat =>
                                <input class={props.targetEquipment ? topInputStyle : inputStyle}
                                    type='number'
                                    value={((props.targetManual as TargetForLevel)[stat()] ?? 0).toString()}
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