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
            if (calculatedAttributes) {
                for (const level in totalTarget()) {
                    let totalCalculatedAttributes = calculateAttributesTotal(calculatedAttributes).health?.[Number(level)] as number;
                    let healthModifer = getModifiers(race as RaceType)?.health as number
                    healthValues[level] = (totalCalculatedAttributes * healthModifer).toFixed(1);
                }
            } else {
                for (const level in totalTarget()) healthValues[level] = '0';
            }
            console.log(healthValues);

        })
    }

    function autoFill() {
        if (window.confirm('Detta kommer skriva över utlagda poäng som är utlagda just nu, är du säker att du vill fortsätta?')) {
            let values = calculateAttributesForRace(race());
            if (values) {
                setAttributes(() => values);
            } else {
                alert(`Det går inte att nå kraven som är valda i profilen med rasen ${RaceNames[race()]}
Ändra krav eller testa en annan ras.`)
            }
        }
    }

    function calculateAttributesForRace(race: RaceType) {
        let result: Attributes = {};
        let rollOver: TargetForLevel = {};
        Object.keys(totalTarget())
            .map(level => Number(level))
            .sort((a, b) => a - b)
            .reverse()
            .forEach((_, index, levels) => {
                let maxLevel = levels[index];
                let minLevel = levels[index + 1] ?? 0;
                let { spanResult, rollOverResult } = calculateForSpan(race, maxLevel, minLevel, totalTarget()[maxLevel], totalTarget()[minLevel], rollOver);
                rollOver = rollOverResult;

                usedStats().forEach(stat => {
                    if (!result[stat])
                        result[stat] = Array(levels[index]).fill(0);

                    spanResult[stat]?.forEach((value, index) => (result[stat] as number[])[(maxLevel - (1 + index))] = value)
                })
            })
        if (Object.keys(rollOver).length !== 0)
            return null;

        return result;
    }

    function calculateForSpan(race: RaceType, maxLevel: number, minLevel: number, maxLevelStats: TargetForLevel, minLevelStats: TargetForLevel, rollOver: TargetForLevel) {
        let pointsNeeded: TargetForLevel = {};
        let levels = maxLevel - minLevel;

        usedStats().forEach(stat => {
            let targetValue = applyModifier(maxLevelStats[stat], stat, race) + (rollOver[stat as Stat] ?? 0);
            let startValue = applyModifier((minLevelStats ?? {})[stat], stat, race);
            if (targetValue !== 0 && targetValue !== startValue && startValue < targetValue) {
                pointsNeeded[stat] = targetValue - startValue;
            }
        })
        rollOver = {};

        let totalPoints = Object.keys(pointsNeeded).map(stat => pointsNeeded[stat as Stat]).reduce((a, b) => a as number + (b as number), 0) as number;
        let maxPoints = (levels * 20) + ((maxLevel >= 1 && minLevel < 1) ? 130 : 0);
        if (totalPoints > maxPoints)
            rollOver = calculateRollOver(pointsNeeded, totalPoints, maxPoints);

        let result = placePointsForSpan(pointsNeeded, levels);

        (result.health ?? []).forEach((_, i) => {
            let sum = Object.keys(result).map(stat => (result[stat as Stat] ?? [])[i]).reduce((a, b) => a + b);
            (result.health ?? [])[i] = (maxLevel === 1 ? 150 : 20) - sum;
        })
        return { spanResult: result, rollOverResult: rollOver };
    }

    function calculateRollOver(pointsNeeded: TargetForLevel, totalPoints: number, maxPoints: number) {
        let rollOver: TargetForLevel = {};
        while (totalPoints > maxPoints) {
            Object.keys(pointsNeeded).forEach(stat => {
                if (totalPoints > maxPoints && (pointsNeeded[stat as Stat] as number > 0)) {
                    pointsNeeded[stat as Stat]--;
                    totalPoints--;
                    if (!rollOver) {
                        rollOver = {};
                    }
                    if (!rollOver[stat as Stat]) {
                        rollOver[stat as Stat] = 0;
                    }
                    rollOver[stat as Stat]++;
                }
            });
        }
        return rollOver;
    }

    function placePointsForSpan(pointsNeeded: TargetForLevel, levels: number): Attributes {
        let result: Attributes = { health: Array(levels).fill(0) };
        let minPoints: TargetForLevel = {}
        let remainder: TargetForLevel = {}

        Object.keys(pointsNeeded).forEach(stat => {
            result[stat as Stat] = Array(levels).fill(0);
            let pointsForStatLevel = Math.floor((pointsNeeded[stat as Stat] as number) / levels);
            minPoints[stat as Stat] = pointsForStatLevel;
            remainder[stat as Stat] = (pointsNeeded[stat as Stat] as number) - (pointsForStatLevel * levels);
        });

        if (levels === 1) {
            return addPoints(result, 0, pointsNeeded);
        }

        for (let i = 0; i < levels; i++) {
            Object.keys(pointsNeeded).forEach(stat => (result[stat as Stat] as number[])[i] = minPoints[stat as Stat] as number);
        }
        Object.keys(remainder).forEach(stat => addRemainder(stat as Stat, remainder[stat as Stat] ?? 0, result, levels))

        return result;
    }

    function addRemainder(stat: Stat, remainder: number, result: Attributes, levels: number) {
        while (remainder !== 0) {
            for (let i = 0; i < levels; i++) {
                let pointsPlaced = Object.keys(result).map(stat => (result[stat as Stat] ?? [])[i]).reduce((a, b) => a + b);
                if (pointsPlaced !== 20 && remainder !== 0) {
                    (result[stat as Stat] ?? [])[i]++;
                    remainder--;
                }
            }
        }
    }

    function addPoints(startAttributes: Attributes, index: number, values: TargetForLevel) {
        Object.keys(values).forEach(stat => {
            ((startAttributes[stat as Stat] as number[])[index] as number) = values[stat as Stat] as number;
        })
        return startAttributes;
    }

    function applyModifier(value: number | undefined, stat: Stat, race: RaceType): number {
        if (value)
            return Math.ceil(value / ((RaceData as Races)[race].stats[stat] as number))
        else
            return 0;
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