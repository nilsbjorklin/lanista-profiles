import { createEffect, createMemo, createSignal } from 'solid-js';
import { Attributes, Profile, Stat, Target } from './data/Types';
import compareObjects from './compareObjects';

export default function AttributesCalculator(getActiveProfile: () => Profile, setProfile: (value: (prev: Profile) => Profile) => void, totalTarget: () => Target) {

    const attributes = createMemo(() => getActiveProfile().attributes, {}, { equals: (prev, next) => compareObjects(prev, next) });
    const [attributesTotal, setAttributesTotal] = createSignal<Attributes>(calculateAttributesTotal(attributes()));

    createEffect(() => setAttributesTotal(calculateAttributesTotal(attributes())));
    
    function getAttributesTotal(arr: number[]) {
        let result: number[] = Array(45);
        let total: number = 0;
        for (let index = 0; index < result.length; index++) {
            let value = arr[index] ?? 0;
            result[index] = value + total;
            total += value;
        }
        return result;
    }

    function calculateAttributesTotal(attr: Attributes) {
        let result: Attributes = {}
        Object.keys(attr).forEach(stat => {
            result[stat as Stat] = getAttributesTotal(attr[stat as Stat] ?? []);
        })
        return result;
    }

    function setAttribute(stat: Stat, index: number, value: number): void {
        setProfile((prev) => {
            prev.attributes[stat] = prev.attributes[stat] ?? Array(index).fill(0);

            if ((prev.attributes[stat] as number[]).length <= index) {
                let length = (prev.attributes[stat] as number[]).length;
                prev.attributes[stat] = (prev.attributes[stat] as number[]).concat(Array(index - length).fill(0))
            }

            (prev.attributes[stat] as number[])[index] = value;

            return prev;
        })
    }

    function setAllAttributes(newAttributes: Attributes): void {
        setProfile((prev) => {
            prev.attributes = newAttributes;
            return prev;
        })
    }

    function autoSelectRace() {
        console.log('autoSelectRace');
    }

    function clearForm() {
        if (window.confirm('Är du säker att du vill ta bort alla utladga poäng?')) {
            setProfile((prev) => {
                prev.attributes = {}
                return prev;
            })
        }
    }

    return { attributes, setAttribute, setAllAttributes, attributesTotal, attributeActions: { autoSelectRace, clearForm } }
}