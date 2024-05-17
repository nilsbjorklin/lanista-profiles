import { createMemo, type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import { Collapsable } from './Components';

const WeaponTypes: { id: UsedAttribute, name: string }[] = [
    { id: 'axes', name: 'Yxor' },
    { id: 'swords', name: 'Svärd' },
    { id: 'maces', name: 'Hammare' },
    { id: 'staves', name: 'Stavar' },
    { id: 'shield', name: 'Sköldar' },
    { id: 'spears', name: 'Stick' },
    { id: 'chain', name: 'Kätting' },
    { id: '2h', name: 'Tvåhand' }
]

const Weapons: Component<{}> = () => {
    const usedAttributes = createMemo(() => useFields()?.usedAttributes() as UsedAttribute[], [], { equals: (prev, next) => prev.equals(next) });
    const toggleWeapon = useFields()?.toggleWeapon as (prev: UsedAttribute) => void;

    const getButtons = () => {
        return WeaponTypes.map(weapon => { return { selected: usedAttributes().includes(weapon.id), text: weapon.name, action: () => toggleWeapon(weapon.id) } });
    }

    const buttons = createMemo(getButtons, [], { equals: (prev, next) => prev.equals(next) })

    return (
        <Collapsable collapsedText='Vapentyp' children={buttons()} selectable={true} />
    )
}


export default Weapons;