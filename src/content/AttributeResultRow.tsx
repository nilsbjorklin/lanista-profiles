import { Index, Match, Switch, type Component } from 'solid-js';
import { useLayout } from '../LayoutProvider';
import { Attributes, Stat } from '../data/Types';
import { Row } from './Components';

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
        <Switch fallback={<div hidden />}>
            <Match when={!useLayout()?.desktop()}>
                <Row>
                    <div class='text-center p-3 border-b font-bold'>{`Egenskaper vid Grad ${props.index + 1}:`}</div>
                </Row>
            </Match>
        </Switch>,
        <Row>
            {useLayout()?.desktop() && <div class='p-3 text-center bg-dark text-light font-bold'>{`Grad ${props.index + 1}`}</div>}
            <Index each={props.usedStats()}>
                {stat => <div class='p-3 text-center bg-dark text-light border-light border-l'>{calculateAttributesWithModifiers(stat(), props?.attributesTotal?.[stat()]?.[props.index])}</div>}
            </Index>
        </Row>
    ])
}

export default AttributeResultRow;