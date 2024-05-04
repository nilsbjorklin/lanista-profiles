import { For, createSignal, Switch, Match, type Component } from 'solid-js';
import { useLayout } from './LayoutProvider';
import Modal from './Modal'


const addProfileText = 'Lägg till ny profil';
const renameProfileText = 'Byt namn på profil';
const cloneProfileText = 'Skapa kopia av profil';
const deleteProfileText = 'Radera profil';

const autoSelectRaceText = 'Välj ras och Fyll i värden';
const autoFillText = 'Fyll i värden';
const clearFormText = 'Rensa';

type WeaponType = {
    id: string,
    name: string
};
const WeaponTypes = [
    { id: "axes", name: "Yxor" },
    { id: "swords", name: "Svärd" },
    { id: "maces", name: "Hammare" },
    { id: "staves", name: "Stavar" },
    { id: "shield", name: "Sköldar" },
    { id: "spears", name: "Stick" },
    { id: "chain", name: "Kätting" },
    { id: "2h", name: "Tvåhand" }
]

const Header: Component<{ usedAttributes: string[], setUsedAttributes: ((prev: any) => any[]) }> = (props) => {
    const [profile, setProfile] = createSignal<string>("Profile 1");
    const [race, setRace] = createSignal<string>("Troll");

    function toggleWeapon(weapon: string) {
        props.setUsedAttributes((prev: string[]) => {
            if (prev.includes(weapon)) {
                console.log(prev.splice(prev.indexOf(weapon), 1));
            } else {
                prev.push(weapon)
            }
            return [...prev]
        })
        props.usedAttributes
    }

    return (
        <div class='pb-2'>
            <Modal />
            <div id='test' class='flex flex-wrap sm:justify-between'>
                <Selector text={profile()} size={(['Profile 1', 'Profile 2', 'Long profile name'].reduce((a, b) => a.length > b.length ? a : b).length) * 10}>
                    <For each={['Profile 1', 'Profile 2', 'Long profile name']}>
                        {item => <HeaderButton text={item} action={() => setProfile(item)} />}
                    </For>
                </Selector>
                <Selector text={race()} size={80}>
                    <For each={['Troll', 'Alv', 'Människa']}>
                        {item => <HeaderButton text={item} action={() => setRace(item)} />}
                    </For>
                </Selector>
                <Collapsable collapsedText='Alternativ'>
                    <HeaderButton text={addProfileText} />
                    <HeaderButton text={renameProfileText} />
                    <HeaderButton text={cloneProfileText} />
                    <HeaderButton text={deleteProfileText} />
                    <HeaderButton text={autoSelectRaceText} />
                    <HeaderButton text={autoFillText} />
                    <HeaderButton text={clearFormText} />
                </Collapsable>
                <div class='flex w-full sm:w-auto sm:inline-block'>
                    <Collapsable collapsedText='Vapentyp'>
                        <For each={WeaponTypes}>
                            {weapon => <Button
                                selected={props.usedAttributes.includes(weapon.id)}
                                text={weapon.name}
                                action={() => toggleWeapon(weapon.id)} />}
                        </For>
                    </Collapsable>
                </div>
            </div>
        </div>
    )
}

const Collapsable: Component<{ children: any, collapsedText: string }> = (props) => {
    return (
        <Switch fallback={props.children}>
            <Match when={!useLayout()?.desktop()}>
                <Selector text={props.collapsedText} size={200}>
                    {props.children}
                </Selector>
            </Match>
        </Switch>
    )
}

const buttonStyling = 'select-none inline-block px-3 py-2 rounded-md border-2 border-dark hover:border-light';
const buttonSelectedStyling = 'select-none inline-block px-3 py-2 rounded-md border-2 border-dark bg-light hover:border-light hover:bg-dark';

const Button: Component<{ text?: string, action?: () => void, selected?: boolean }> = (props) => {
    return (
        <Switch fallback={<HeaderButton text={props.text} action={props.action} />}>
            <Match when={props.selected}>
                <SelectedButton text={props.text} action={props.action} />
            </Match>
        </Switch>
    )
}

const HeaderButton: Component<{ class?: string, text?: string, action?: () => void }> = (props) => {
    return <a
        class='select-none inline-block px-3 py-2 rounded-md border-2 border-transparent hover:border-light'
        onClick={props.action}>
        {props.text}
    </a>
};

const SelectedButton: Component<{ text?: string, action?: () => void }> = (props) => {
    return <a
        class='select-none inline-block px-3 py-2 rounded-md border-2 border-dark bg-light hover:border-light hover:text-light hover:bg-dark text-dark'
        onClick={props.action}>
        {props.text}
    </a>
};

const Selector: Component<{ children: any, text: string, size: number }> = (props) => {
    return (
        <div class='relative inline-block'>
            <Button text={props.text} />
            <div style={`min-width: ${props.size}px`} class='hidden shadow shadow-light p-1 absolute display-on-previous-hover bg-dark hover:block sm:w-[100vw]'>
                {props.children}
            </div>
        </div>
    )
};

export default Header;