import { Index, Switch, Match, type Component } from 'solid-js';
import { useLayout } from './LayoutProvider';
import { RaceType, UsedAttribute } from './data/Types'


const addProfileText = 'Lägg till ny profil';
const renameProfileText = 'Byt namn på profil';
const cloneProfileText = 'Skapa kopia av profil';
const deleteProfileText = 'Radera profil';

const autoSelectRaceText = 'Välj ras och Fyll i värden';
const autoFillText = 'Fyll i värden';
const clearFormText = 'Rensa';

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

const Races: { [key in RaceType]: string } = {
    human: 'Människa',
    elf: 'Alv',
    dwarf: 'Dvärg',
    orc: 'Ork',
    troll: 'Troll',
    goblin: 'Goblin',
    undead: 'Odöd'
}

const Header: Component<{
    profileId: string,
    profileList: { [key: string]: string }
    race: RaceType,
    setRace: ((prev: RaceType) => void),
    usedAttributes: UsedAttribute[],
    setUsedAttributes: ((prev: UsedAttribute[]) => void),
    switchProfile: ((prev: string) => void),
    addProfile: ((prev: string) => void),
    renameProfile: ((prev: string) => void),
    cloneProfile: ((prev: string) => void),
    deleteProfile: (() => void),
    autoSelectRace: (() => void),
    autoFill: (() => void),
    clearForm: (() => void)
}> = (props) => {

    function toggleWeapon(weapon: UsedAttribute) {
        let newArr = props.usedAttributes.slice();
        if (newArr.includes(weapon)) {
            newArr.splice(props.usedAttributes.indexOf(weapon), 1)
        } else {
            newArr.push(weapon)
        }
        props.setUsedAttributes(newArr)
    }

    return (
        <div class={useLayout()?.textSize()}>
            <div class='flex flex-row flex-wrap sm:justify-between'>
                <Selector
                    text={props.profileList[props.profileId]}
                    size={Object.keys(props.profileList).map(id => props.profileList[id]).reduce((a, b) => a.length > b.length ? a : b).length * 10}>
                    <Index each={Object.keys(props.profileList)}>
                        {profileId => <HeaderButton text={props.profileList[profileId()]} action={() => props.switchProfile(profileId())} />}
                    </Index>
                </Selector>
                <Selector text={Races[props.race]} size={80}>
                    <Index each={Object.keys(Races)}>
                        {race => <HeaderButton text={Races[race() as RaceType]} action={() => props.setRace(race() as RaceType)} />}
                    </Index>
                </Selector>
                <Collapsable collapsedText='Alternativ'>
                    <HeaderButton text={addProfileText} action={() => props.addProfile('new name')} />
                    <HeaderButton text={renameProfileText} action={() => props.renameProfile('re-name')} />
                    <HeaderButton text={cloneProfileText} action={() => props.cloneProfile('clone name')} />
                    <HeaderButton text={deleteProfileText} action={props.deleteProfile} />
                    <HeaderButton text={autoSelectRaceText} action={props.autoSelectRace} />
                    <HeaderButton text={autoFillText} action={props.autoFill} />
                    <HeaderButton text={clearFormText} action={props.clearForm} />
                </Collapsable>
                <div class='flex w-full sm:w-auto sm:inline-block'>
                    <Collapsable collapsedText='Vapentyp'>
                        <Index each={WeaponTypes}>
                            {weapon => <Button
                                selected={props.usedAttributes.includes(weapon().id)}
                                text={weapon().name}
                                action={() => toggleWeapon(weapon().id)} />}
                        </Index>
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

const HeaderButton: Component<{ text?: string | undefined, action?: (() => void) | undefined }> = (props) => {
    return <a
        class='select-none inline-block px-3 py-2 rounded-md border-2 border-transparent hover:border-light'
        onClick={props.action ?? (() => { })}>
        {props.text}
    </a>
};

const SelectedButton: Component<{ text?: string | undefined, action?: (() => void) | undefined }> = (props) => {
    return <a
        class='select-none inline-block px-3 py-2 rounded-md border-2 border-dark bg-light hover:border-light hover:text-light hover:bg-dark text-dark'
        onClick={props.action ?? (() => { })}>
        {props.text}
    </a>
};

const Selector: Component<{ children: any, text: string, size: number }> = (props) => {
    return (
        <div class='relative inline-block'>
            <Button text={props.text} />
            <div style={`min-width: ${props.size}px`} class='hidden shadow shadow-light p-1 sm:left-0 sm:right-0 absolute sm:fixed display-on-previous-hover bg-dark hover:block'>
                {props.children}
            </div>
        </div>
    )
};

export default Header;