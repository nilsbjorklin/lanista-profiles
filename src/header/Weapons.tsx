import { createMemo, type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import { WeaponNames, WeaponTypes } from '../data/Types';
import { Collapsable } from './Components';


const Weapons: Component<{}> = () => {
    const usedAttributes = createMemo(() => useFields()?.usedAttributes() as UsedAttribute[], [], { equals: (prev, next) => prev.equals(next) });
    const toggleWeapon = useFields()?.toggleWeapon as (prev: UsedAttribute) => void;

    const getButtons = () => {
        return (WeaponTypes as (WeaponType | '2h')[]).concat(['2h']).map(weapon => { return { selected: usedAttributes().includes(weapon), text: WeaponNames[weapon], action: () => toggleWeapon(weapon) } });
    }

    const buttons = createMemo(getButtons, [], { equals: (prev, next) => prev.equals(next) })

    return (
        <Collapsable collapsedText='Vapentyp' children={buttons()} selectable={true} />
    )
}


export default Weapons;