import { createMemo, createSignal } from 'solid-js';
import { Attributes, Profile, Stat } from './data/Types';

export default function AttributesCalculator(getActiveProfile: () => Profile, setProfiles: (value: (prev: any) => any) => void) {
    const attributes = createMemo(() => getActiveProfile().attributes, {}, { equals: (prev, next) => compareAttributes(prev, next) });
    const [attributesTotal, setAttributesTotal] = createSignal<Attributes>(setInitialAttributesTotal());

    function compareAttributes(prev: Attributes, next: Attributes): boolean {
        let prevKeys = Object.keys(prev) as Stat[];
        let nextKeys = Object.keys(next) as Stat[];

        if (!prevKeys.equals(nextKeys)) {
            prevKeys
                .filter(stat => !nextKeys.includes(stat))
                .forEach(stat => updateAttributesTotal(stat, []));
            nextKeys
                .filter(stat => !prevKeys.includes(stat))
                .forEach(stat => updateAttributesTotal(stat, next[stat] as number[]));
            return false;
        }
        let result = true;

        prevKeys.forEach(stat => {
            let prevStat = prev[stat] as number[];
            let nextStat = next[stat] as number[];
            if (!prevStat.equals(nextStat)) {
                updateAttributesTotal(stat, nextStat);
                result = false;
            }
        })
        return result;
    }

    function updateAttributesTotal(stat: Stat, value: number[]) {
        setAttributesTotal((prev) => {
            prev[stat] = getAttributesTotal(stat, value);
            return structuredClone(prev);
        })
    }

    function getAttributesTotal(stat: Stat, value: number[]) {
        let result: number[] = Array(value.length);
        let total: number = 0;
        value.forEach((value, index) => {
            result[index] = value + total;
            total += value;
        })
        return result;
    }

    function setInitialAttributesTotal() {
        let result: Attributes = {}
        Object.keys(attributes()).forEach(stat => {
            result[stat as Stat] = getAttributesTotal(stat as Stat, attributes()[stat as Stat] ?? []);
        })

        return result;
    }

    function setAttribute(stat: Stat, index: number, value: number): void {
        setProfiles((prev) => {
            let profiles = structuredClone(prev);
            profiles.profiles[profiles.active].attributes[stat] = profiles.profiles[profiles.active].attributes[stat] ?? Array(index).fill(0);

            if ((profiles.profiles[profiles.active].attributes[stat] as number[]).length <= index) {
                let length = (profiles.profiles[profiles.active].attributes[stat] as number[]).length;
                profiles.profiles[profiles.active].attributes[stat] = (profiles.profiles[profiles.active].attributes[stat] as number[]).concat(Array(index - length).fill(0))
            }

            (profiles.profiles[profiles.active].attributes[stat] as number[])[index] = value;

            return profiles;
        })
    }

    function autoSelectRace() {
        console.log('autoSelectRace');
    }

    function autoFill() {
        console.log('autoFill');
    }

    function clearForm() {
        setProfiles((prev) => {
            prev.profiles[prev.active].attributes = {}
            return structuredClone(prev);
        })
    }

    return { attributes, setAttribute, attributesTotal, attributeActions: { autoSelectRace, autoFill, clearForm } }
}