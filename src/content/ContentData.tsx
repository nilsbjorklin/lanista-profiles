import { Index, Switch, Match, type Component } from 'solid-js';
import { useLayout } from '../LayoutProvider';
import { Attributes } from '../data/Types'
import { Stat } from '../data/Types'
import { Row } from './Components'

const ContentData: Component<{
    usedStats: () => Stat[],
    modifiers: () => { [key in Stat]?: number },
    attributes: Attributes,
    setAttribute: (stat: Stat, index: number, value: number) => void,
    attributesTotal: Attributes
}> = (props) => {

    function calculateAttributesWithModifiers(stat: Stat, attribute: number | undefined) {
        return ((attribute ?? 0) * (props.modifiers()[stat] ?? 1)).toFixed(1);
    }

    function pointsLeft(index: number) {
        let totalPoints = (index === 0 ? 150 : 20);
        props.usedStats().forEach(stat => totalPoints -= props.attributes[stat]?.[index] ?? 0)
        return totalPoints
    }

    return (
        <div class='grid grid-flow-row auto-cols-fr overflow-y-scroll scrollbar-none'>
            <Index each={Array(45)}>
                {(_item, index) => ([
                    <Switch fallback={<div hidden />}>
                        <Match when={!useLayout()?.desktop()}>
                            <Row>
                                <div class='text-center p-3 border-t font-bold'>{`Gradning till Grad ${index + 1}:`}</div>
                            </Row>
                        </Match>
                    </Switch>,
                    <Row>
                        {useLayout()?.desktop() && <div class={`p-3 text-center bg-light text-dark font-bold ${index === 0 ? 'rounded-bl-md' : 'rounded-l-md'}`}>{pointsLeft(index)}</div>}
                        <Index each={props.usedStats()}>
                            {stat =>
                                <input class={`input-no-button p-3 text-center bg-light text-dark border-dark border-l last:${index === 0 ? 'rounded-br-md' : 'rounded-r-md'}`}
                                    type='number'
                                    value={(props?.attributes?.[stat()]?.[index] ?? 0).toString()}
                                    onInput={e => props.setAttribute(stat(), index, Number(e.target.value))} />
                            }
                        </Index>
                    </Row>,
                    <Switch fallback={<div hidden />}>
                        <Match when={!useLayout()?.desktop()}>
                            <Row>
                                <div class='text-center p-3 border-b font-bold'>{`Egenskaper vid Grad ${index + 1}:`}</div>
                            </Row>
                        </Match>
                    </Switch>,
                    <Row>
                        {useLayout()?.desktop() && <div class='p-3 text-center bg-dark text-light font-bold'>{`Grad ${index + 1}`}</div>}
                        <Index each={props.usedStats()}>
                            {stat => <div class='p-3 text-center bg-dark text-light border-light border-l'>{calculateAttributesWithModifiers(stat(), props?.attributesTotal?.[stat()]?.[index])}</div>}
                        </Index>
                    </Row>
                ])}
            </Index>
        </div>
    )
}

export default ContentData;