import { Index, type Component } from 'solid-js';
import { Attributes, Stat } from '../data/Types';
import Row from './Row';

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
        <Row class='rounded-t sm:rounded bg-light text-dark'>
           <div class={'col-span-2 p-3 text-center font-bold'}>Poäng kvar: {pointsLeft(props.index)}</div>
            <Index each={props.usedStats()}>
                {stat =>
                    <input class='input-no-button p-3 text-center bg-none bg-transparent border-l first:border-l-none sm:border-t'
                        type='number'
                        value={(props?.attributes?.[stat()]?.[props.index] ?? 0).toString()}
                        onInput={e => props.setAttribute(stat(), props.index, Number(e.target.value))} />
                }
            </Index>
        </Row>
    ])
}

export default AttributeRow;