import { createContext, createMemo, useContext } from "solid-js";
import compareObjects from "../compareObjects";
import { Attributes, Equipment, Modifier, Profile, RaceType, Races, Stat, Target, UsedAttribute } from "../data/Types";
import RaceData from '../data/raceData.json';
import { useProfile } from "./ProfileProvider";
import AttributesCalculator from "./AttributesCalculator";
import TargetCalculator from "./TargetCalculator";

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
    attributes: {
        values: () => Attributes,
        set: (value: (prev: Attributes) => Attributes) => void,
        setAttribute: (stat: Stat, index: number, value: number) => void,
        total: () => Attributes,
        autoSelectRace: () => void,
        autoFill: () => void,
        clearForm: () => void
    }
    target: {
        values: () => Target,
        set: (level: number, stat: Stat, value: number) => void,
        equipment: () => Target,
        total: () => Target,
    },
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

    const target = TargetCalculator(getProfile, setProfile);
    const attributes = AttributesCalculator(getProfile, setProfile, race, usedStats, target.total);

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
            target,
            equipment,
            test
        }}>
            {props.children}
        </FieldsContext.Provider>
    );
}