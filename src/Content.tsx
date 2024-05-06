import { Index, Switch, Match, type Component, createMemo } from 'solid-js';
import { useLayout } from './LayoutProvider';
import StatLabelData from './data/statLabelData.json';
import RaceData from './data/raceData.json';
import compareObjects from './compareObjects';
import { Attributes, RaceType, UsedAttribute } from './data/Types'
import { Stat } from './data/Types'

const baseStats: Stat[] = ['health', 'strength', 'endurance', 'initiative', 'dodge'];

const Content: Component<{
    race: RaceType,
    usedAttributes: UsedAttribute[],
    attributes: Attributes,
    setAttribute: (stat: Stat, index: number, value: number) => void,
    attributesTotal: Attributes
}> = (props) => {
    type Races = {
        [key in RaceType]: {
            name: string;
            stats: {
                [key in Stat]: number
            }
        }
    }
    type Modifier = {
        [key in Stat]?: number
    }
    type StatLabels = {
        [key in Stat]: {
            sm: string,
            md: string,
            lg: string,
            xl: string
        }
    }

    const usedStats: () => Stat[] = createMemo(() => getUsedStats(), {}, { equals: (prev, next) => prev.equals(next) });
    const modifiers: () => Modifier = createMemo(() => getModifiers(), {}, { equals: (prev, next) => compareObjects(prev, next) });

    function getModifiers(): Modifier {
        let result: Modifier = {};
        usedStats().forEach(stat => {
            result[stat] = (RaceData as Races)[props.race].stats[stat];
        })
        return result;
    }

    function getUsedStats(): Stat[] {
        return baseStats.concat(props.usedAttributes.filter(attr => attr !== '2h') as Stat[]);
    }

    function calculateAttributesWithModifiers(stat: Stat, attribute: number | undefined) {
        return ((attribute ?? 0) * (modifiers()[stat] ?? 1)).toFixed(1);
    }

    return (
        <div class='flex flex-col overflow-hidden' >
            <div class='flex flex-col w-full rounded-t-md border-2 border-light mt-1'>
                <Row>
                    {useLayout()?.desktop() && <ContentHeaderCell value={'Egenskaper'} />}
                    <Index each={usedStats()}>
                        {stat => <ContentHeaderCell value={(StatLabelData as StatLabels)[stat()][useLayout()?.size() ?? 'sm']} />}
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
                            <Index each={usedStats()}>
                                {stat =>
                                    <input class={`input-no-button p-3 text-center bg-light text-dark border-dark border-l last:${index === 0 ? 'rounded-br-md' : 'rounded-r-md'}`}
                                        type='number'
                                        value={(props?.attributes?.[stat()]?.[index] ?? 0).toString()}
                                        onChange={e => props.setAttribute(stat(), index, Number(e.target.value))} />
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
                            <Index each={usedStats()}>
                                {stat => <div class='p-3 text-center bg-dark text-light border-light border-l'>{calculateAttributesWithModifiers(stat(), props?.attributesTotal?.[stat()]?.[index])}</div>}
                            </Index>
                        </Row>
                    ])}
                </Index>
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