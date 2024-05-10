import { createMemo } from 'solid-js';
import compareObjects from './compareObjects';
import { useProfile } from './contexts/ProfileProvider';
import { Accessory, AccessoryType, Armor, ArmorType, Profile, Stat, Target, WeaponType, Weapons } from './data/Types';

export default function CalculateTarget() {
    const getProfile = useProfile()?.getProfile as () => Profile;

    const manualTarget = createMemo(() => getProfile().target, {}, { equals: (prev, next) => compareObjects(prev, next) });
    const equipmentTarget = createMemo(() => getEquipmentTarget(), {}, { equals: (prev, next) => compareObjects(prev, next) });
    const totalTarget = createMemo(() => getTotalTarget(), {}, { equals: (prev, next) => compareObjects(prev, next) });

    function getEquipmentTarget(): Target {
        let result: Target = {};
        Object.keys(getProfile().equipment).forEach(level => {
            let eqp = getProfile().equipment[level];
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

    return { target: { manualTarget, equipmentTarget, totalTarget } };
}