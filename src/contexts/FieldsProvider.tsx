import { createContext, createMemo, useContext } from "solid-js";
import compareObjects from "../compareObjects";
import { Attributes, Equipment, Modifier, Profile, RaceType, Races, Stat, Target, UsedAttribute } from "../data/Types";
import RaceData from '../data/raceData.json';
import { useProfile } from "./ProfileProvider";

const baseStats: Stat[] = ['health', 'strength', 'endurance', 'initiative', 'dodge'];

const FieldsContext = createContext<{
    race: () => RaceType,
    setRace: (race: RaceType) => void,
    usedAttributes: () => UsedAttribute[],
    setUsedAttributes: (usedAttributes: UsedAttribute[]) => void,
    usedStats: () => Stat[],
    modifiers: () => Modifier,
    getModifiers: (race?: RaceType) => Modifier,
    twoHanded: () => boolean,
    attributes: () => Attributes,
    setAttributes: (value: (prev: Attributes) => Attributes) => void,
    target: () => Target;
    setTarget: (level: number, stat: Stat, value: number) => void,
    equipment: () => Equipment,
    test: () => void
}>();

export function useFields() {
    return useContext(FieldsContext);
}

export function FieldsProvider(props: { children: any }) {
    const getProfile = useProfile()?.getProfile as () => Profile;
    const setProfile = useProfile()?.setProfile as (value: (prev: Profile) => Profile) => void;
    //race
    const race: () => RaceType = createMemo(() => getProfile()?.race ?? 'human');

    const setRace = (race: RaceType): void => {
        setProfile((prev) => {
            prev.race = race
            return prev;
        })
    }

    //usedAttributes
    const usedAttributes: () => UsedAttribute[] = createMemo(() => getProfile().usedAttributes ?? [], [], { equals: (prev, next) => (prev as UsedAttribute[]).equals(next as UsedAttribute[]) });

    const setUsedAttributes = (usedAttributes: UsedAttribute[]): void => {
        setProfile((prev) => {
            prev.usedAttributes = usedAttributes
            return prev;
        })
    }
    const getUsedStats = (): Stat[] => baseStats.concat(usedAttributes()?.filter(attr => attr !== '2h') as Stat[])
    const usedStats: () => Stat[] = createMemo(() => getUsedStats(), {}, { equals: (prev, next) => prev.equals(next) });
    const twoHanded = (): boolean => usedAttributes()?.includes('2h') ?? false

    //Modifiers
    const getModifiers = (raceValue?: RaceType): Modifier => {
        let result: Modifier = {};
        usedStats().forEach(stat => result[stat] = (RaceData as Races)[raceValue ?? race()].stats[stat])
        return result;
    }
    const modifiers: () => Modifier = createMemo(() => getModifiers(), {}, { equals: (prev, next) => compareObjects(prev, next) });

    //attributes
    const attributes = createMemo(() => getProfile()?.attributes ?? {}, {});

    function setAttributes(value: (prev: Attributes) => Attributes): void {
        let next = value(structuredClone(attributes()));
        if (!compareObjects(attributes(), next)) {
            setProfile((prev) => {
                prev.attributes = next;
                return prev;
            })
        }
    }

    //target
    const target = createMemo(() => getProfile()?.target ?? {}, {});
    const setTarget = (level: number, stat: Stat, value: number): void => {
        setProfile((prev) => {
            prev.target[level][stat] = value;
            return prev;
        })
    }
    const test = () => {
        console.log(getProfile());
    }

    //equipment
    const equipment = createMemo(() => getProfile()?.equipment ?? {}, {});
    return (
        <FieldsContext.Provider value={{
            race,
            setRace,
            usedAttributes,
            setUsedAttributes,
            usedStats,
            twoHanded,
            modifiers,
            getModifiers,
            attributes,
            setAttributes,
            target,
            setTarget,
            equipment,
            test
        }}>
            {props.children}
        </FieldsContext.Provider>
    );
}