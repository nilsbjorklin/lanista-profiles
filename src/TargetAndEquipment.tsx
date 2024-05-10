import { createEffect, createMemo, createSignal } from 'solid-js';
import compareObjects from './compareObjects';
import { Equipment, Profile, Stat, Target, Weapons, Armor, ArmorType, Accessory, WeaponType, AccessoryType } from './data/Types';

export default function TargetAndEquipment(getActiveProfile: () => Profile, setProfile: (value: (prev: Profile) => Profile) => void) {
    const [level, setLevel] = createSignal<number>(1);
    const manualTarget = createMemo(() => getActiveProfile().target, {}, { equals: (prev, next) => compareByLevel(prev, next, level()) });
    const equipmentTarget = createMemo(() => getEquipmentTarget(), {}, { equals: (prev, next) => compareByLevel(prev, next, level()) });
    const totalTarget = createMemo(() => getTotalTarget(), {}, { equals: (prev, next) => compareByLevel(prev, next, level()) });
    const equipment = createMemo(() => getActiveProfile().equipment, {}, { equals: (prev, next) => compareByLevel(prev, next, level()) });

    function compareByLevel(prev: Target | Equipment, next: Target | Equipment, level: number | undefined): boolean {
        if (level) {
            return compareObjects(prev[level], next[level]);
        }
        return false;
    }

    function getEquipmentTarget(): Target {
        let result: Target = {};
        Object.keys(getActiveProfile().equipment).forEach(level => {
            let eqp = getActiveProfile().equipment[level];
            result[level] = getRequirementForCategory(
                eqp.weapon ?? {},
                eqp.armor ?? {},
                eqp.accessories ?? {});

        });
        return result;
    }

    function getRequirementForCategory(weapons: Weapons, armorList: Armor, accessories: Accessory) {
        let result: { [key in Stat]?: number } = {};
        if (weapons) {
            Object.keys(weapons).forEach(weapon => {
                let attributes = weapons[weapon as WeaponType]?.requirements?.attributes;
                if (attributes) {
                    Object.keys(attributes).forEach(stat => {
                        let value = attributes?.[stat as Stat];
                        if (value) {
                            if ((weapon as WeaponType) === 'offhand' && (stat as Stat) === 'strength')
                                value *= 2;
                            result[stat as Stat] = Math.max(value, result[stat as Stat] ?? 0);
                        }
                    })
                }
            })
        }
        if (armorList) {
            Object.keys(armorList).forEach(armor => {
                let attributes = armorList[armor as ArmorType]?.requirements?.attributes;
                if (attributes) {
                    Object.keys(attributes).forEach(stat => {
                        let value = attributes?.[stat as Stat];
                        if (value) {
                            result[stat as Stat] = Math.max(value, result[stat as Stat] ?? 0);
                        }
                    })
                }
            })
        }

        if (accessories) {
            Object.keys(accessories).forEach(accessory => {
                let attributes = accessories[accessory as AccessoryType]?.requirements?.attributes;
                if (attributes) {
                    Object.keys(attributes).forEach(stat => {
                        let value = attributes?.[stat as Stat];
                        if (value) {
                            result[stat as Stat] = Math.max(value, result[stat as Stat] ?? 0);
                        }
                    })
                }
            })
        }
        return result;
    }

    function getTotalTarget(): Target {
        let result: Target = {};
        Object.keys(manualTarget()).forEach(level => {
            let targetForLevel = manualTarget()[level];
            Object.keys(targetForLevel).forEach(stat => {
                let value = targetForLevel[stat as Stat];
                if (value) {
                    if (!result[level]) {
                        result[level] = {};
                    }
                    result[level][stat as Stat] = value;
                }
            })
        })
        Object.keys(equipmentTarget()).forEach(level => {
            let targetForLevel = equipmentTarget()[level];
            Object.keys(targetForLevel).forEach(stat => {
                let value = targetForLevel[stat as Stat];
                if (value) {
                    if (!result[level]) {
                        result[level] = {};
                    }
                    let prevValue = result[level][stat as Stat];
                    if (prevValue)
                        result[level][stat as Stat] = Math.max(value, prevValue);
                    else
                        result[level][stat as Stat] = value;
                }
            })
        })
        return result;
    }


    function setTarget(level: number, stat: Stat, value: number): void {
        setLevel(level);
        setProfile((prev) => {
            prev.target[level][stat] = value;
            return prev;
        })
    }

    return { target: { manualTarget, equipmentTarget, totalTarget }, setTarget, equipment };
}