import { Index, type Component } from 'solid-js';
import { Attributes, Stat } from '../data/Types';
import Row from './Row';

const AttributeResultRow: Component<{
    index: number,
    usedStats: () => Stat[],
    modifiers: () => { [key in Stat]?: number },
    attributesTotal: Attributes
}> = (props) => {

    function calculateAttributesWithModifiers(stat: Stat, attribute: number | undefined) {
        return ((attribute ?? 0) * (props.modifiers()[stat] ?? 1)).toFixed(1);
    }

    return ([
        <Row class='border-x border-r sm:border-none'>
            <div class='col-span-2 p-3 text-center bg-dark text-light font-bold border-b sm:border-none'>Med bonus</div>
            <Index each={props.usedStats()}>
                {stat => (
                    <div class='p-3 text-center bg-dark text-light border-light border-l sm:first:border-l-0  border-b sm:border-y'>
                        {calculateAttributesWithModifiers(stat(), props?.attributesTotal?.[stat()]?.[props.index])}
                    </div>
                )}
            </Index>
        </Row>
    ])
}

export default AttributeResultRow;