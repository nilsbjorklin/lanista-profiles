import { type Component } from 'solid-js';
import { HeaderButton, Collapsable } from './Components'
import { useProfile } from '../contexts/ProfileProvider';
import { useFields } from '../contexts/FieldsProvider';

const addProfileText = 'Lägg till ny profil';
const renameProfileText = 'Byt namn på profil';
const cloneProfileText = 'Skapa kopia av profil';
const deleteProfileText = 'Radera profil';

const autoSelectRaceText = 'Välj ras och Fyll i värden';
const autoFillText = 'Fyll i värden';
const clearFormText = 'Rensa';

const Options: Component<{
    testFunction: (() => void)
}> = (props) => {
    const addProfile = useProfile()?.addProfile;
    const renameProfile = useProfile()?.renameProfile;
    const cloneProfile = useProfile()?.cloneProfile;
    const deleteProfile = useProfile()?.deleteProfile;
    const autoSelectRace = useFields()?.attributes.autoSelectRace;
    const autoFill = useFields()?.attributes.autoFill;
    const clearForm = useFields()?.attributes.clearForm;
    return (
        <Collapsable collapsedText='Alternativ'>
            <HeaderButton text={addProfileText} action={() => addProfile?.('new name')} />
            <HeaderButton text={renameProfileText} action={() => renameProfile?.('re-name')} />
            <HeaderButton text={cloneProfileText} action={() => cloneProfile?.('clone name')} />
            <HeaderButton text={deleteProfileText} action={deleteProfile} />
            <HeaderButton text={autoSelectRaceText} action={autoSelectRace} />
            <HeaderButton text={autoFillText} action={autoFill} />
            <HeaderButton text={clearFormText} action={clearForm} />
            <HeaderButton text='TEST' action={props.testFunction} />
        </Collapsable>
    )
}


export default Options;