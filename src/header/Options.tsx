import { type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import { useProfile } from '../contexts/ProfileProvider';
import { Collapsable } from './Components';

const addProfileText = 'Lägg till ny profil';
const renameProfileText = 'Byt namn på profil';
const cloneProfileText = 'Skapa kopia av profil';
const deleteProfileText = 'Radera profil';

const autoSelectRaceText = 'Välj ras och Fyll i värden';
const autoFillText = 'Fyll i värden';
const clearFormText = 'Rensa';

const Options: Component<{}> = () => {
    const addProfile = useProfile()?.addProfile;
    const renameProfile = useProfile()?.renameProfile;
    const cloneProfile = useProfile()?.cloneProfile;
    const deleteProfile = useProfile()?.deleteProfile;
    const autoSelectRace = useFields()?.attributes.autoSelectRace;
    const autoFill = useFields()?.attributes.autoFill;
    const clearForm = useFields()?.attributes.clearForm;
    const test = useFields()?.test;

    const profileOptions = [
        {
            text: addProfileText,
            action: () => addProfile?.('very very long new name')
        },
        {
            text: renameProfileText,
            action: () => renameProfile?.('re-name')
        },
        {
            text: cloneProfileText,
            action: () => cloneProfile?.('clone name')
        },
        {
            text: deleteProfileText,
            action: deleteProfile
        }
    ];

    const otherOptions = [
        {
            text: autoSelectRaceText,
            action: autoSelectRace
        },
        {
            text: autoFillText,
            action: autoFill
        },
        {
            text: clearFormText,
            action: clearForm
        },
        {
            text: 'TEST',
            action: test
        }
    ];

    return ([
        <Collapsable collapsedText='Profil alternativ' children={profileOptions} />,
        <Collapsable collapsedText='Beräkna egenskaper' children={otherOptions} />
    ])
}


export default Options;