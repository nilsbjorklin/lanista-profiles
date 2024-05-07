import { createMemo } from 'solid-js';

import compareObjects from './compareObjects';
import { Profile, RaceType, Stat, UsedAttribute } from './data/Types';
import RaceData from './data/raceData.json';

const baseStats: Stat[] = ['health', 'strength', 'endurance', 'initiative', 'dodge'];

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

export default function StatsAndModifiers(getActiveProfile: () => Profile, setProfiles: (value: (prev: any) => any) => void) {
    const race: () => RaceType = createMemo(() => getActiveProfile().race);

    const usedAttributes: () => UsedAttribute[] = createMemo(() => getActiveProfile().usedAttributes, [], { equals: (prev, next) => prev.equals(next) });

    const usedStats: () => Stat[] = createMemo(() => getUsedStats(), {}, { equals: (prev, next) => prev.equals(next) });
    const modifiers: () => Modifier = createMemo(() => getModifiers(), {}, { equals: (prev, next) => compareObjects(prev, next) });

    function getModifiers(): Modifier {
        let result: Modifier = {};
        usedStats().forEach(stat => {
            result[stat] = (RaceData as Races)[race()].stats[stat];
        })
        return result;
    }

    function getUsedStats(): Stat[] {
        return baseStats.concat(usedAttributes().filter(attr => attr !== '2h') as Stat[]);
    }

    function setRace(race: RaceType): void {
        setProfiles((prev) => {
            prev.profiles[prev.active].race = race
            return structuredClone(prev);
        })
    }

    function setUsedAttributes(usedAttributes: UsedAttribute[]): void {
        setProfiles((prev) => {
            prev.profiles[prev.active].usedAttributes = usedAttributes
            return structuredClone(prev);
        })
    }

    return { race, setRace, usedAttributes, setUsedAttributes, usedStats, modifiers }
}