import { Index, type Component } from 'solid-js';
import Row from './Row';
import { useFields } from '../contexts/FieldsProvider';

const AttributeRow: Component<{ index: number }> = (props) => {
    const usedStats = useFields()?.usedStats as () => Stat[];
    const attributes = useFields()?.attributes.values as () => Attributes;
    const setAttribute = useFields()?.attributes.setAttribute as (stat: Stat, index: number, value: number) => void;

    function pointsLeft(index: number) {
        let totalPoints = (index === 0 ? 150 : 20);
        usedStats().forEach(stat => totalPoints -= attributes()[stat]?.[index] ?? 0)
        return totalPoints
    }

    return ([
        <Row class='border-t'>
            <div class={'col-span-2 p-3 text-center font-bold'}>Poäng kvar: {pointsLeft(props.index)}</div>
            <Index each={usedStats()}>
                {stat =>
                    <input class='input-no-button p-3 text-center bg-none bg-transparent border-l sm:first:border-l-0 sm:border-t'
                        type='number'
                        value={(attributes()[stat()]?.[props.index] ?? 0).toString()}
                        onInput={e => setAttribute?.(stat(), props.index, Number(e.target.value))} />
                }
            </Index>
        </Row>
    ])
}

export default AttributeRow;