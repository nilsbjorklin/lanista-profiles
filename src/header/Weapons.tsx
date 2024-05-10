import { Index, type Component } from 'solid-js';
import { UsedAttribute } from '../data/Types'
import { Button, Collapsable } from './Components'
import { useFields } from '../contexts/FieldsProvider';

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

    return (
        <div class='flex w-full sm:w-auto sm:inline-block'>
            <Collapsable collapsedText='Vapentyp'>
                <Index each={WeaponTypes}>
                    {weapon => <Button
                        selected={usedAttributes().includes(weapon().id)}
                        text={weapon().name}
                        action={() => toggleWeapon(weapon().id)} />}
                </Index>
            </Collapsable>
        </div>
    )
}


export default Weapons;