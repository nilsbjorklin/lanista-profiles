import { createEffect, createSignal } from 'solid-js';
import { useFields } from './contexts/FieldsProvider';
import { Attributes, Stat } from './data/Types';

export default function AttributesAndStats() {
    const setAllAttributes = useFields()?.setAllAttributes;
    const [attributesTotal, setAttributesTotal] = createSignal<Attributes>(calculateAttributesTotal(useFields()?.attributes()));

    createEffect(() => setAttributesTotal(calculateAttributesTotal(useFields()?.attributes())));

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

    function calculateAttributesTotal(attr: Attributes | undefined) {
        let result: Attributes = {}
        if (attr)
            Object.keys(attr).forEach(stat => result[stat as Stat] = getAttributesTotal(attr[stat as Stat] ?? []))

        return result;
    }

    function autoSelectRace() {
        console.log('autoSelectRace');
    }

    function clearForm() {
        if (window.confirm('Är du säker att du vill ta bort alla utladga poäng?')) {
            setAllAttributes?.({});
        }
    }

    return { attributesTotal, attributeActions: { autoSelectRace, clearForm } }
}