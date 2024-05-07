import { Index, Match, Switch, type Component } from 'solid-js';
import { useLayout } from '../LayoutProvider';
import { Attributes, Stat } from '../data/Types';
import { Row } from './Components';

const AttributeRow: Component<{
    index: number,
    usedStats: () => Stat[],
    attributes: Attributes,
    setAttribute: (stat: Stat, index: number, value: number) => void
}> = (props) => {

    function pointsLeft(index: number) {
        let totalPoints = (index === 0 ? 150 : 20);
        props.usedStats().forEach(stat => totalPoints -= props.attributes[stat]?.[index] ?? 0)
        return totalPoints
    }

    return ([
        <Switch fallback={<div hidden />}>
            <Match when={!useLayout()?.desktop()}>
                <Row>
                    <div class='text-center p-3 border-t font-bold'>{`Gradning till Grad ${props.index + 1}:`}</div>
                </Row>
            </Match>
        </Switch>,
        <Row>
            {useLayout()?.desktop() && <div class={`p-3 text-center bg-light text-dark font-bold ${props.index === 0 ? 'rounded-bl-md' : 'rounded-l-md'}`}>{pointsLeft(props.index)}</div>}
            <Index each={props.usedStats()}>
                {stat =>
                    <input class={`input-no-button p-3 text-center bg-light text-dark border-dark border-l last:${props.index === 0 ? 'rounded-br-md' : 'rounded-r-md'}`}
                        type='number'
                        value={(props?.attributes?.[stat()]?.[props.index] ?? 0).toString()}
                        onInput={e => props.setAttribute(stat(), props.index, Number(e.target.value))} />
                }
            </Index>
        </Row>
    ])
}

export default AttributeRow;