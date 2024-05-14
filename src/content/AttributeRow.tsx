import { Index, type Component } from 'solid-js';
import Row from './Row';
import { useFields } from '../contexts/FieldsProvider';
import RowLabel from './RowLabel';
import RowInput from './RowInput';

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
            <RowLabel>Poäng kvar: {pointsLeft(props.index)}</RowLabel>
            <Index each={usedStats()}>
                {stat =>
                    <RowInput
                        class='normal'
                        value={(attributes()[stat()]?.[props.index] ?? 0)}
                        onInput={e => setAttribute?.(stat(), props.index, Number(e?.target?.value))} />
                }
            </Index>
        </Row>
    ])
}

export default AttributeRow;