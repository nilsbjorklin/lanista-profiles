import { type Component } from 'solid-js';
import { HeaderButton, Collapsable } from './Components'

const addProfileText = 'Lägg till ny profil';
const renameProfileText = 'Byt namn på profil';
const cloneProfileText = 'Skapa kopia av profil';
const deleteProfileText = 'Radera profil';

const autoSelectRaceText = 'Välj ras och Fyll i värden';
const autoFillText = 'Fyll i värden';
const clearFormText = 'Rensa';

const Options: Component<{
    addProfile: ((prev: string) => void),
    renameProfile: ((prev: string) => void),
    cloneProfile: ((prev: string) => void),
    deleteProfile: (() => void),
    autoSelectRace: (() => void),
    autoFill: (() => void),
    clearForm: (() => void),
    testFunction: (() => void)
}> = (props) => {
    return (
        <Collapsable collapsedText='Alternativ'>
            <HeaderButton text={addProfileText} action={() => props.addProfile('new name')} />
            <HeaderButton text={renameProfileText} action={() => props.renameProfile('re-name')} />
            <HeaderButton text={cloneProfileText} action={() => props.cloneProfile('clone name')} />
            <HeaderButton text={deleteProfileText} action={props.deleteProfile} />
            <HeaderButton text={autoSelectRaceText} action={props.autoSelectRace} />
            <HeaderButton text={autoFillText} action={props.autoFill} />
            <HeaderButton text={clearFormText} action={props.clearForm} />
            <HeaderButton text='TEST' action={props.testFunction} />
        </Collapsable>
    )
}


export default Options;