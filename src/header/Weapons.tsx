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

const Weapons: Component<{
}> = (props) => {

    const usedAttributes = useFields()?.usedAttributes as () => UsedAttribute[];
    const setUsedAttributes = useFields()?.setUsedAttributes as (prev: UsedAttribute[]) => void;

    function toggleWeapon(weapon: UsedAttribute) {
        let newArr = usedAttributes().slice();
        if (newArr.includes(weapon)) {
            newArr.splice(usedAttributes().indexOf(weapon), 1)
        } else {
            newArr.push(weapon)
        }
        setUsedAttributes(newArr)
    }

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