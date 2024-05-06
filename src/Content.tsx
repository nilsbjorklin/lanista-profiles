import { Index, createEffect, createSignal, Switch, Match, type Component, createMemo } from 'solid-js';
import { useLayout } from './LayoutProvider';
import Stats from './data/stats.json';
import Races from './data/races.json';
import compareObjects from './compareObjects';
import { Attributes, Race, UsedAttribute } from './data/Types'
import { Stat } from './data/Types'

const baseStats: Stat[] = ['health', 'strength', 'endurance', 'initiative', 'dodge'];

const Content: Component<{
    race: Race,
    usedAttributes: UsedAttribute[],
    attributes: Attributes
}> = (props) => {
    interface Race {
        [key: string]: {
            name: string;
            stats: {
                [key: string]: number
            }
        }
    }

    const [usedStats, setUsedStats] = createSignal<Stat[]>(baseStats);
    const modifiers = createMemo(() => getModifiers(), {}, { equals: (prev, next) => compareObjects(prev, next) });

    function getModifiers() {
        let result: { [key: string]: number } = {};
        usedStats().forEach(stat => {
            result[stat] = (Races as Race)[props.race].stats[stat];
        })
        return result;
    }

    createEffect(() => {
        setUsedStats(baseStats.concat(props.usedAttributes.filter(attr => attr !== '2h') as Stat[]))
    });

    // sm less than 600, md less than 900, lg less than 1200, xl larger or equal to 1200
    //class={useLayout()?.textSize()}
    return (
        <div class='flex flex-col overflow-hidden' >
            <div class='flex flex-col w-full rounded-t-md border-2 border-light mt-1'>
                <Row>
                    {useLayout()?.desktop() && <ContentHeaderCell value={'Egenskaper'} />}
                    <Index each={usedStats()}>
                        {stat => <ContentHeaderCell value={(Stats as { [key: string]: { sm: string, md: string, lg: string, xl: string } })[stat()][useLayout()?.size() ?? 'sm']} />}
                    </Index>
                </Row>
                <Row>
                    {useLayout()?.desktop() && <ContentHeaderCell value={'Bonus'} />}
                    <Index each={usedStats()}>
                        {stat => <ContentHeaderCell value={Math.round((modifiers()[stat()] ?? 1) * 100) + '%'} />}
                    </Index>
                </Row>
            </div>
            <div class='grid grid-flow-row auto-cols-fr overflow-y-scroll scrollbar-none'>
                <Switch fallback={<div>NOT SET</div>}>
                    <Match when={Object.keys(props.attributes).length !== 0}>
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
                                    {useLayout()?.desktop() && <div class={`p-3 text-center bg-light text-dark font-bold ${index === 0 ? 'rounded-bl-md' : 'rounded-l-md'}`}>{(index === 0 ? 150 : 20) - 15}</div>}
                                    <Index each={Object.keys(props.attributes) as Stat[]}>
                                        {stat => <div class={`p-3 text-center bg-light text-dark border-dark border-l last:${index === 0 ? 'rounded-br-md' : 'rounded-r-md'}`}>{props?.attributes?.[stat()]?.[index]}</div>}
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
                                    <Index each={Object.keys(props.attributes) as Stat[]}>
                                        {stat => <div class='p-3 text-center bg-dark text-light border-light border-l'>{props?.attributes?.[stat()]?.[index]}</div>}
                                    </Index>
                                </Row>
                            ])}
                        </Index>
                    </Match>
                </Switch>
            </div>
        </div>
    )
}

const Row: Component<{ children: any }> = (props) => {
    return (
        <div class='grid auto-cols-fr grid-flow-col first:border-b'>
            {props.children}
        </div>
    )
}

const ContentHeaderCell: Component<{ value: string }> = (props) => {
    return (
        <div class='p-3 text-center font-bold border-l first:border-dark border-light whitespace-nowrap overflow-hidden'>
            {props.value}
        </div>
    )
}

export default Content;