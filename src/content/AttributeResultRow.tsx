import { Index, type Component } from 'solid-js';
import Row from './Row';
import { useFields } from '../contexts/FieldsProvider';
import RowLabel from './RowLabel';
import RowCell from './RowCell';

const AttributeResultRow: Component<{ index: number }> = (props) => {
    const usedStats = useFields()?.usedStats as () => Stat[];
    const modifiers = useFields()?.modifiers as () => { [key in Stat]?: number };
    const attributesTotal = useFields()?.attributes.total as () => Attributes;


    function calculateAttributesWithModifiers(stat: Stat, attribute: number | undefined) {
        return ((attribute ?? 0) * (modifiers()[stat] ?? 1)).toFixed(1);
    }

    return ([
        <Row class='inverted'>
            <RowLabel>Med bonus</RowLabel>
            <Index each={usedStats()}>
                {stat => (
                    <RowCell>
                        {calculateAttributesWithModifiers(stat(), attributesTotal()?.[stat()]?.[props.index])}
                    </RowCell>
                )}
            </Index>
        </Row>
    ])
}

export default AttributeResultRow;