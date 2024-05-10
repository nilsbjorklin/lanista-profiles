import { createContext, createMemo, useContext } from "solid-js";
import compareObjects from "../compareObjects";
import { Attributes, Stat } from "../data/Types";
import { useFields } from "./FieldsProvider";

const AttributesContext = createContext<{
    setAttribute: (stat: Stat, index: number, value: number) => void,
    attributesTotal: () => Attributes,
    clearForm: () => void
}>();

export function useAttributes() {
    return useContext(AttributesContext);
}

export function AttributesProvider(props: { children: any }) {
    const attributes = useFields()?.attributes as () => Attributes;
    const setAttributes = useFields()?.setAttributes as (value: (prev: Attributes) => Attributes) => void;

    const attributesTotal = createMemo(() => calculateAttributesTotal(), {}, { equals: (prev, next) => compareObjects(prev, next) });

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

    function calculateAttributesTotal(): Attributes {
        let result: Attributes = {}
        if (attributes()) {
            Object.keys(attributes()).forEach(stat => {
                let statResult: number[] = Array(45);
                let total: number = 0;
                let arr = attributes()[stat as Stat] ?? [];
                for (let index = 0; index < statResult.length; index++) {
                    let value = arr[index] ?? 0;
                    statResult[index] = value + total;
                    total += value;
                }
                result[stat as Stat] = statResult;
            })
        }
        return result;
    }

    const clearForm = () => {
        if (window.confirm('Är du säker att du vill ta bort alla utladga poäng?')) {
            setAttributes(() => {
                return {};
            })
        }
    }

    return (
        <AttributesContext.Provider value={{
            setAttribute,
            attributesTotal,
            clearForm
        }}>
            {props.children}
        </AttributesContext.Provider>
    );
}