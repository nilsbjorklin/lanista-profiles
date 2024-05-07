import { type Component, createMemo } from 'solid-js';
import RaceData from '../data/raceData.json';
import compareObjects from '../compareObjects';
import { Attributes, RaceType, UsedAttribute } from '../data/Types'
import { Stat } from '../data/Types'
import ContentHeader from './ContentHeader';
import ContentData from './ContentData';

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

    return (
        <div class='flex flex-col overflow-hidden' >
            <ContentHeader usedStats={usedStats} modifiers={modifiers} />
            <ContentData usedStats={usedStats} modifiers={modifiers} attributes={props.attributes} setAttribute={props.setAttribute} attributesTotal={props.attributesTotal} />
        </div>
    )
}

export default Content;