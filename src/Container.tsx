import { type Component } from 'solid-js';

import AttributesCalculator from './AttributesCalculator';

import StatsAndModifiers from './StatsAndModifiers';
import TargetAndEquipment from './TargetAndEquipment';


import Header from './header/Header';
import Options from './header/Options';
import ProfileSelector from './header/ProfileSelector';
import RaceSelector from './header/RaceSelector';
import Weapons from './header/Weapons';

import { useProfile } from './ProfileProvider';
import Content from './content/Content';
import ContentData from './content/ContentData';
import ContentHeader from './content/ContentHeader';
import { Attributes, Profile, Stat, TargetForLevel } from './data/Types';

const Container: Component = () => {
    let getProfile = useProfile()?.getProfile as () => Profile;
    let setProfile = useProfile()?.setProfile as (value: (prev: Profile) => Profile) => void;
    const { target, setTarget, equipment } = TargetAndEquipment(getProfile, setProfile);
    const { attributes, setAttribute, setAllAttributes, attributesTotal, attributeActions } = AttributesCalculator(getProfile, setProfile, target.totalTarget);
    const { race, setRace, usedAttributes, setUsedAttributes, usedStats, modifiers, twoHanded } = StatsAndModifiers(getProfile, setProfile);

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

                Object.keys(resultForSpan).forEach(stat => {
                    if (!result[stat as Stat])
                        result[stat as Stat] = Array(levels[index]).fill(0);

                    resultForSpan[stat as Stat]?.forEach((value, index) => (result[stat as Stat] as number[])[(maxLevel - (1 + index))] = value)
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
