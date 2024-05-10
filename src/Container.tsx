import { createEffect, type Component } from 'solid-js';

import AttributesCalculator from './AttributesCalculator';

import StatsAndModifiers from './StatsAndModifiers';
import TargetAndEquipment from './TargetAndEquipment';


import Header from './header/Header';
import Options from './header/Options';
import ProfileSelector from './header/ProfileSelector';
import RaceSelector from './header/RaceSelector';
import Weapons from './header/Weapons';

import Content from './content/Content';
import ContentData from './content/ContentData';
import ContentHeader from './content/ContentHeader';
import { useProfile } from './ProfileProvider';
import { Attributes, Profile, Stat, Target, TargetForLevel } from './data/Types';

const Container: Component = () => {
    let getProfile = useProfile()?.getProfile as () => Profile;
    let setProfile = useProfile()?.setProfile as (value: (prev: Profile) => Profile) => void;
    const { target, setTarget, equipment } = TargetAndEquipment(getProfile, setProfile);
    const { attributes, setAttribute, setAllAttributes, attributesTotal, attributeActions } = AttributesCalculator(getProfile, setProfile, target.totalTarget);
    const { race, setRace, usedAttributes, setUsedAttributes, usedStats, modifiers, twoHanded } = StatsAndModifiers(getProfile, setProfile);

    function autoFill2() {
        let pointsNeeded: Target = {};
        usedStats().forEach(stat => {
            Object.keys(target.totalTarget()).forEach(level => {
                let value = target.totalTarget()[level][stat as Stat] ?? 0;
                if (!pointsNeeded[level]) {
                    pointsNeeded[level] = {};
                }
                let pointsNeededForStat = Math.ceil(value / (modifiers()[stat as Stat] as number));
                pointsNeeded[level][stat as Stat] = pointsNeededForStat;
            })
        });

        let totalPointsFromLast: Target = {};
        let averagePointsFromLast: Target = {};
        let lastLevel = 0;
        usedStats().forEach(stat => {
            Object.keys(pointsNeeded).forEach(level => {
                if (!averagePointsFromLast[level]) {
                    averagePointsFromLast[level] = {};
                    totalPointsFromLast[level] = {};
                }
                let pointsNeededForStat = 0;
                if (Number(level) === 1) {
                    pointsNeededForStat = pointsNeeded[level][stat as Stat] ?? 0
                    lastLevel = 0;
                } else {
                    let previousValue = (Number(level) !== 1 ? pointsNeeded[lastLevel][stat as Stat] : 0) as number;
                    pointsNeededForStat = Math.max((pointsNeeded[level][stat as Stat] ?? 0) - previousValue, 0);
                }
                totalPointsFromLast[level][stat as Stat] = pointsNeededForStat;
                averagePointsFromLast[level][stat as Stat] = Math.ceil(pointsNeededForStat / (Number(level) - lastLevel));

                lastLevel = Number(level);
            })
        });

        let calibrated = calibrateTarget(structuredClone(averagePointsFromLast), validate(averagePointsFromLast))
        let startingLevel = Object.keys(calibrated)
            .map(level => Number(level))
            .sort((a, b) => a - b)
            .reverse()[0];
        let pointsPerLevel = calibrated[startingLevel];
        let pointsTotal = calibrated[startingLevel];
        let attributes: Attributes = {}
        for (let level = startingLevel; level > 0; level--) {
            if (calibrated[level]) {
                pointsPerLevel = calibrated[level];
                pointsTotal = totalPointsFromLast[startingLevel];
            }
            let pointsSpentForStat = 0;
            usedStats().forEach(stat => {
                if ((pointsPerLevel[stat] && pointsPerLevel[stat] !== 0) || attributes[stat]) {
                    if (!attributes[stat]) {
                        attributes[stat] = [];
                    }
                    pointsSpentForStat += pointsPerLevel[stat] as number;
                    console.log(pointsSpentForStat);
                    console.log(pointsPerLevel[stat]);
                    console.log((pointsNeeded[level][stat as Stat] as number));


                    if (pointsSpentForStat >= (pointsNeeded[level][stat as Stat] as number)) {

                    } else {
                        attributes[stat]?.push(pointsPerLevel[stat] as number)
                    }
                }
            })
        }
        Object.keys(attributes).forEach(stat => {
            attributes[stat as Stat]?.reverse();
        })
        setAllAttributes(attributes);

    }

    function validate(validateTarget: Target): { [key: string]: number } {
        let pointsLeftForLevel: { [key: string]: number } = {}
        Object.keys(validateTarget).forEach(level => {
            let totalForLevel = 0;
            usedStats().forEach(stat => {
                totalForLevel += validateTarget[level][stat] as number;
            });
            let max = 150;
            if (level !== "1")
                max = 20;
            pointsLeftForLevel[level] = max - totalForLevel;
        })
        return pointsLeftForLevel;
    }

    function calibrateTarget(pointsNeededBetweenLevels: Target, pointsLeftForLevel: { [key: string]: number }): Target {
        let result: Target = {};
        let rolloverStat: Stat | undefined;
        let rolloverValue: number;
        let rolledOver = false;
        Object.keys(pointsNeededBetweenLevels)
            .map(level => Number(level))
            .sort((a, b) => a - b)
            .reverse().forEach(level => {
                if (rolloverStat) {
                    console.log('level: ' + level);

                    console.log(pointsNeededBetweenLevels[level][rolloverStat]);
                    console.log(pointsLeftForLevel[level]);
                    console.log(`Rolling over stat ${rolloverStat} of value ${rolloverValue}`);

                    pointsNeededBetweenLevels[level][rolloverStat] += rolloverValue;
                    pointsLeftForLevel[level] -= rolloverValue;
                    rolledOver = true;
                }
                if (pointsLeftForLevel[level] > 0) {
                    if (rolledOver) {
                        console.log('level: ' + level);
                        console.log(pointsNeededBetweenLevels[level][rolloverStat as Stat]);
                        console.log(pointsLeftForLevel[level]);
                        rolloverStat = undefined;
                        rolloverValue = 0;
                        rolledOver = false;
                    }
                    result[level] = pointsNeededBetweenLevels[level];
                } else {
                    let statName = '';
                    let statValue = 0;
                    Object.keys(pointsNeededBetweenLevels[level]).forEach(stat => {
                        let value = pointsNeededBetweenLevels[level][stat as Stat] as number;
                        if (value > statValue) {
                            statValue = value;
                            statName = stat;
                        }
                    })
                    rolloverStat = statName as Stat;
                    rolloverValue = pointsLeftForLevel[level] * -1;
                    pointsNeededBetweenLevels[level][rolloverStat] -= rolloverValue;
                    result[level] = pointsNeededBetweenLevels[level];

                }
            })
        return result;
    }

    function autoFill() {
        let result: Attributes = {};
        Object.keys(target.totalTarget())
            .map(level => Number(level))
            .sort((a, b) => a - b)
            .reverse()
            .forEach((_, index, levels) => {
                let maxLevel = levels[index];
                let minLevel = levels[index + 1] ?? 0;
                let resultForSpan = calculateForSpan(maxLevel, minLevel, target.totalTarget()[maxLevel], target.totalTarget()[minLevel]);
                console.log(resultForSpan);

                Object.keys(resultForSpan).forEach(stat => {
                    if (!result[stat as Stat]) {
                        result[stat as Stat] = Array(levels[index]).fill(0);
                    }
                    resultForSpan[stat as Stat]?.forEach((value, index) => {
                        (result[stat as Stat] as number[])[(maxLevel - (1 + index))] = value;
                    })
                })
            })
        setAllAttributes(result);
    }

    function calculateForSpan(maxLevel: number, minLevel: number, maxLevelStats: TargetForLevel, minLevelStats: TargetForLevel) {
        let result: Attributes = {};
        Object.keys(maxLevelStats).forEach(stat => {
            let targetValue = applyModifier(maxLevelStats[stat as Stat], stat as Stat);
            let startValue = applyModifier((minLevelStats ?? {})[stat as Stat], stat as Stat);
            if (targetValue !== 0 && targetValue !== startValue)
                result[stat as Stat] = calculateStatForSpan(targetValue - startValue, maxLevel - minLevel);

        })
        return result;
    }

    function applyModifier(value: number | undefined, stat: Stat): number {
        if (value)
            return Math.ceil(value / (modifiers()[stat] as number))
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

    return (
        <div class='flex flex-col bg-dark text-light sm:w-screen md:w-[600px] lg:w-[80vw] w-[1120px]'>
            <Header>
                <ProfileSelector />
                <RaceSelector
                    race={race()}
                    setRace={setRace} />
                <Options
                    autoSelectRace={attributeActions.autoSelectRace}
                    autoFill={autoFill}
                    clearForm={attributeActions.clearForm}
                    testFunction={() => console.log(getProfile())} />
                <Weapons
                    usedAttributes={usedAttributes()}
                    setUsedAttributes={setUsedAttributes} />
            </Header>
            <Content>
                <ContentHeader
                    usedStats={usedStats}
                    modifiers={modifiers}
                    race={race()} />
                <ContentData
                    usedStats={usedStats}
                    modifiers={modifiers}
                    attributes={attributes()}
                    setAttribute={setAttribute}
                    attributesTotal={attributesTotal()}
                    target={{ manual: target.manualTarget(), equipment: target.equipmentTarget(), total: target.totalTarget() }}
                    setTarget={setTarget}
                    equipment={equipment()}
                    twoHanded={twoHanded()} />
            </Content>
        </div>
    );
}

export default Container;
