import { createMemo } from "solid-js";
import compareObjects from "../compareObjects";
import { Attributes, Profile, RaceNames, RaceType, Races, Stat, Target, TargetForLevel } from "../data/Types";
import RaceData from '../data/raceData.json';

export default function AttributesCalculator(
    getProfile: () => Profile,
    setProfile: (value: (prev: Profile) => Profile) => void,
    race: () => RaceType,
    usedStats: () => Stat[],
    totalTarget: () => Target
) {

    const attributes = createMemo(() => getProfile()?.attributes ?? {}, {}, { equals: (prev, next) => compareObjects(prev, next) });
    const attributesTotal = createMemo(() => calculateAttributesTotal(), {}, { equals: (prev, next) => compareObjects(prev, next) });

    function setAttributes(value: (prev: Attributes) => Attributes): void {
        let next = value(structuredClone(attributes()));
        if (!compareObjects(attributes(), next)) {
            setProfile((prev) => {
                prev.attributes = next;
                return prev;
            })
        }
    }

    const setAttribute = (stat: Stat, index: number, value: number): void => {
        setAttributes((prev) => {
            prev[stat] = prev[stat] ?? Array(index).fill(0)

            if ((prev[stat] as number[]).length <= index) {
                let length = (prev[stat] as number[]).length;
                prev[stat] = (prev[stat] as number[]).concat(Array(index - length).fill(0))
            }

            (prev[stat] as number[])[index] = value;

            return prev;
        })
    }

    function calculateAttributesTotal(): Attributes {
        let result: Attributes = {}
        if (attributes?.()) {
            Object.keys(attributes()).forEach(stat => {
                let statResult: number[] = Array(45);
                let total: number = 0;
                let arr = attributes()[stat as Stat] ?? [];
                for (let index = 0; index < statResult.length; index++) {
                    let value = arr[index] ?? 0;
                    statResult[index] = value + total;
                    total += value;
                }
                result[stat as Stat] = statResult;
            })
        }
        return result;
    }


    function autoSelectRace() {
        Object.keys(RaceNames).forEach(race => {
            console.log(RaceNames[race as RaceType]);
            console.log(calculateAttributesForRace(race as RaceType));
        })
    }

    function autoFill() {
        if (window.confirm('Detta kommer skriva över utlagda poäng som är utlagda just nu, är du säker att du vill fortsätta?')) {
            setAttributes(() => {
                return calculateAttributesForRace(race());
            })
        }
    }

    function calculateAttributesForRace(race: RaceType) {
        console.log('calculateAttributesForRace');

        let result: Attributes = {};
        Object.keys(totalTarget())
            .map(level => Number(level))
            .sort((a, b) => a - b)
            .reverse()
            .forEach((_, index, levels) => {
                let maxLevel = levels[index];
                let minLevel = levels[index + 1] ?? 0;
                let resultForSpan = calculateForSpan(race, maxLevel, minLevel, totalTarget()[maxLevel], totalTarget()[minLevel]);

                usedStats().forEach(stat => {
                    if (!result[stat])
                        result[stat] = Array(levels[index]).fill(0);

                    resultForSpan[stat]?.forEach((value, index) => (result[stat] as number[])[(maxLevel - (1 + index))] = value)
                })
            })
        return result;
    }

    function calculateForSpan(race: RaceType, maxLevel: number, minLevel: number, maxLevelStats: TargetForLevel, minLevelStats: TargetForLevel) {
        let resultForSpan: Attributes = {};
        usedStats().forEach(stat => {
            let targetValue = applyModifier(maxLevelStats[stat], stat, race);
            let startValue = applyModifier((minLevelStats ?? {})[stat], stat, race);
            if (targetValue !== 0 && targetValue !== startValue) {
                resultForSpan[stat] = calculateStatForSpan(targetValue - startValue, maxLevel - minLevel);
            }
        })
        resultForSpan.health = calculateHealthForSpan(resultForSpan, maxLevel - minLevel, maxLevel === 1);
        return resultForSpan;
    }

    function calculateHealthForSpan(otherAttributes: Attributes, length: number, isFirst: boolean) {
        let health: number[] = [];
        for (let i = 0; i < length; i++) {
            let pointsSet = 0;
            usedStats().forEach(stat => {
                let attributeForStat = otherAttributes[stat as Stat] ?? [];
                pointsSet += attributeForStat[i] ?? 0;

            })
            health[i] = (isFirst ? 150 : 20) - pointsSet;
        }
        return health;
    }

    function applyModifier(value: number | undefined, stat: Stat, race: RaceType): number {
        if (value)
            return Math.ceil(value / ((RaceData as Races)[race].stats[stat] as number))
        else
            return 0;
    }

    function calculateStatForSpan(pointsNeeded: number, levels: number): number[] {
        let arr: number[] = Array(levels).fill(0);
        let totalPoints = 0;
        while (pointsNeeded > totalPoints) {
            for (let i = 0; i < levels; i++) {
                if (pointsNeeded > totalPoints) {
                    arr[i]++;
                    totalPoints++;
                }
            }
        }
        return arr;
    }

    const clearForm = () => {
        if (window.confirm('Är du säker att du vill ta bort alla utladga poäng?')) {
            setAttributes(() => {
                return {};
            })
        }
    }

    return ({
        values: attributes,
        set: setAttributes,
        setAttribute,
        total: attributesTotal,
        autoSelectRace,
        autoFill,
        clearForm
    });
}