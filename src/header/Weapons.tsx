import { type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import { UsedAttribute } from '../data/Types';
import { ChildButton, Collapsable } from './Components';

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

    const usedAttributes = useFields()?.usedAttributes as () => UsedAttribute[];
    const toggleWeapon = useFields()?.toggleWeapon as (prev: UsedAttribute) => void;

    let children: ChildButton[] = WeaponTypes.map(weapon => { return { selected: usedAttributes().includes(weapon.id), text: weapon.name, action: () => toggleWeapon(weapon.id) } })

    return (
        <Collapsable collapsedText='Vapentyp' children={children} />
    )
}


export default Weapons;