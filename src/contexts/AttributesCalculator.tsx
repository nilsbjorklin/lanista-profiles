import { createMemo } from "solid-js";
import compareObjects from "../compareObjects";
import { RaceNames } from "../data/Types";
import RaceData from '../data/raceData.json';

export default function AttributesCalculator(
    getProfile: () => Profile,
    setProfile: (value: (prev: Profile) => Profile) => void,
    race: () => RaceType,
    usedStats: () => Stat[],
    totalTarget: () => Target,
    getModifiers: (race?: RaceType) => Modifier
) {
    const attributes = createMemo(() => getProfile()?.attributes ?? {}, {}, { equals: (prev, next) => compareObjects(prev, next) });
    const attributesTotal = createMemo(() => calculateAttributesTotal(attributes()), {}, { equals: (prev, next) => compareObjects(prev, next) });

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

    function calculateAttributesTotal(attributeValues: Attributes): Attributes {
        let result: Attributes = {}
        if (attributeValues) {
            for (const stat in attributeValues) {
                let statResult: number[] = Array(45);
                let total: number = 0;
                let arr = attributeValues[stat as Stat] ?? [];
                for (let index = 0; index < statResult.length; index++) {
                    let value = arr[index] ?? 0;
                    statResult[index] = value + total;
                    total += value;
                }
                result[stat as Stat] = statResult;
            }
        }
        return result;
    }


    function autoSelectRace() {
        Object.keys(RaceNames).forEach(race => {
            console.log(RaceNames[race as RaceType]);
            let calculatedAttributes = calculateAttributesForRace(race as RaceType);
            let healthValues: Record<string, String> = {};

            for (const level in totalTarget()) {
                let totalCalculatedAttributes = calculateAttributesTotal(calculatedAttributes).health?.[Number(level)] as number;
                let healthModifer = getModifiers(race as RaceType)?.health as number
                healthValues[level] = (totalCalculatedAttributes * healthModifer).toFixed(1);
            }
            console.log(healthValues);

        })
    }

    function autoFill() {
        if (window.confirm('Detta kommer skriva över utlagda poäng som är utlagda just nu, är du säker att du vill fortsätta?')) {
            setAttributes(() => {
                return calculateAttributesForRace(race());
            })
        }
    }

    const forEach = <K extends keyof any, V>(values: Record<K, V>, callBack: (key: K, value: V) => void): void => {
        Object.keys(values).forEach(key => callBack(key as K, values[key as K] as V));
    }

    const map = <K extends keyof any, V>(values: Record<K, V>, callBack: (key: K, value: V) => V): Record<K, V> => {
        let result = {} as Record<K, V>;
        Object.keys(values).map(key => callBack(key as K, values[key as K] as V));
        return result;
    }

    function calculateAttributesForRace(race: RaceType) {
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
        let pointsNeeded: TargetForLevel = {};
        let levels = maxLevel - minLevel;
        usedStats().forEach(stat => {
            let targetValue = applyModifier(maxLevelStats[stat], stat, race);
            let startValue = applyModifier((minLevelStats ?? {})[stat], stat, race);
            if (targetValue !== 0 && targetValue !== startValue) {
                pointsNeeded[stat] = targetValue - startValue;
            }
        })
        let totalPoints = Object.keys(pointsNeeded).map(stat => pointsNeeded[stat as Stat]).reduce((a, b) => a as number + (b as number), 0) as number;
        let maxPoints = (levels * 20) + (maxLevel >= 1 && minLevel <= 1 ? 130 : 0);
        if (maxPoints < totalPoints) {
            throw new Error('non posible')
        }

        resultForSpan.health = calculateHealthForSpan(resultForSpan, maxLevel - minLevel, maxLevel === 1);
        return resultForSpan;
    }

    function tryToAdd(attr: Attributes,) {

    }

    function calculateHealthForSpan(otherAttributes: Attributes, length: number, isFirst: boolean) {
        let health: number[] = [];
        for (let i = 0; i < length; i++) {
            let pointsSet = 0;
            usedStats().forEach(stat => {
                let attributeForStat = otherAttributes[stat as Stat] ?? [];
                pointsSet += attributeForStat[i] ?? 0;

            })
            let healthValue = (isFirst ? 150 : 20) - pointsSet;
            if (healthValue < 0) {
                console.log(healthValue);

                throw new Error("");
            }
            health[i] = healthValue;
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