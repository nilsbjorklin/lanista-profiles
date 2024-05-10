import { type Component } from 'solid-js';
import { HeaderButton, Collapsable } from './Components'
import { useProfile } from '../contexts/ProfileProvider';

const addProfileText = 'Lägg till ny profil';
const renameProfileText = 'Byt namn på profil';
const cloneProfileText = 'Skapa kopia av profil';
const deleteProfileText = 'Radera profil';

const autoSelectRaceText = 'Välj ras och Fyll i värden';
const autoFillText = 'Fyll i värden';
const clearFormText = 'Rensa';

const Options: Component<{
    autoSelectRace: (() => void),
    autoFill: (() => void),
    clearForm: (() => void),
    testFunction: (() => void)
}> = (props) => {
    let addProfile = useProfile()?.addProfile;
    let renameProfile = useProfile()?.renameProfile;
    let cloneProfile = useProfile()?.cloneProfile;
    let deleteProfile = useProfile()?.deleteProfile;
    return (
        <Collapsable collapsedText='Alternativ'>
            <HeaderButton text={addProfileText} action={() => addProfile?.('new name')} />
            <HeaderButton text={renameProfileText} action={() => renameProfile?.('re-name')} />
            <HeaderButton text={cloneProfileText} action={() => cloneProfile?.('clone name')} />
            <HeaderButton text={deleteProfileText} action={deleteProfile} />
            <HeaderButton text={autoSelectRaceText} action={props.autoSelectRace} />
            <HeaderButton text={autoFillText} action={props.autoFill} />
            <HeaderButton text={clearFormText} action={props.clearForm} />
            <HeaderButton text='TEST' action={props.testFunction} />
        </Collapsable>
    )
}


export default Options;