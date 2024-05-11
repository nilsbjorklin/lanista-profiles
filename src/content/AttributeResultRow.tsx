import { Index, type Component } from 'solid-js';
import Row from './Row';
import { useFields } from '../contexts/FieldsProvider';

const AttributeResultRow: Component<{ index: number }> = (props) => {
    const usedStats = useFields()?.usedStats as () => Stat[];
    const modifiers = useFields()?.modifiers as () => { [key in Stat]?: number };
    const attributesTotal = useFields()?.attributes.total as () => Attributes;


    function calculateAttributesWithModifiers(stat: Stat, attribute: number | undefined) {
        return ((attribute ?? 0) * (modifiers()[stat] ?? 1)).toFixed(1);
    }

    return ([
        <Row class=' bg-light text-dark border-dark'>
            <div class='col-span-2 p-3 text-center font-bold'>Med bonus</div>
            <Index each={usedStats()}>
                {stat => (
                    <div class='p-3 text-center border-l sm:first:border-l-0 sm:border-t'>
                        {calculateAttributesWithModifiers(stat(), attributesTotal()?.[stat()]?.[props.index])}
                    </div>
                )}
            </Index>
        </Row>
    ])
}

export default AttributeResultRow;