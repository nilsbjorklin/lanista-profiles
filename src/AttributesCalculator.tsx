import { useFields } from "./contexts/FieldsProvider";
import { Attributes, RaceType, Races, Stat, Target, TargetForLevel } from "./data/Types";
import RaceData from './data/raceData.json';


export default function AttributesCalculator(target: () => Target) {
    const setAllAttributes = useFields()?.setAllAttributes;
    const race = useFields()?.race as () => RaceType;
    const usedStats = useFields()?.usedStats as () => Stat[]

    function autoFill() {
        let result: Attributes = {};

        Object.keys(target())
            .map(level => Number(level))
            .sort((a, b) => a - b)
            .reverse()
            .forEach((_, index, levels) => {
                let maxLevel = levels[index];
                let minLevel = levels[index + 1] ?? 0;
                let resultForSpan = calculateForSpan(maxLevel, minLevel, target()[maxLevel], target()[minLevel]);

                usedStats().forEach(stat => {
                    if (!result[stat])
                        result[stat] = Array(levels[index]).fill(0);

                    resultForSpan[stat]?.forEach((value, index) => (result[stat] as number[])[(maxLevel - (1 + index))] = value)
                })
            })
        setAllAttributes?.(result);
    }

    function calculateForSpan(maxLevel: number, minLevel: number, maxLevelStats: TargetForLevel, minLevelStats: TargetForLevel) {
        let result: Attributes = {};
        usedStats().forEach(stat => {
            let targetValue = applyModifier(maxLevelStats[stat], stat, race());
            let startValue = applyModifier((minLevelStats ?? {})[stat], stat, race());
            if (targetValue !== 0 && targetValue !== startValue)
                result[stat] = calculateStatForSpan(targetValue - startValue, maxLevel - minLevel);

        })
        return result;
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

    return { autoFill }
}