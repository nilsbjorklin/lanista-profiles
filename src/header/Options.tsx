import { createSignal, type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import { useProfile } from '../contexts/ProfileProvider';
import { Collapsable } from './Components';
import NameModal from './NameModal';

const addProfileText = 'Lägg till ny profil';
const renameProfileText = 'Byt namn på profil';
const cloneProfileText = 'Skapa kopia av profil';
const deleteProfileText = 'Radera profil';

const autoSelectRaceText = 'Välj ras och Fyll i värden';
const autoFillText = 'Fyll i värden';
const clearFormText = 'Rensa';

const Options: Component<{}> = () => {
    const [title, setTitle] = createSignal('');
    const [display, setDisplay] = createSignal(false);
    const [action, setAction] = createSignal((name:string) => {});

    const addProfile = useProfile()?.addProfile as (name: string) => void;
    const renameProfile = useProfile()?.renameProfile as (name: string) => void;
    const cloneProfile = useProfile()?.cloneProfile as (name: string) => void;
    const deleteProfile = useProfile()?.deleteProfile;
    const autoSelectRace = useFields()?.attributes.autoSelectRace;
    const autoFill = useFields()?.attributes.autoFill;
    const clearForm = useFields()?.attributes.clearForm;
    const test = useFields()?.test;


    function openModal(modalTitle: string, modalAction: (name: string) => void) {
        setTitle(modalTitle);
        setDisplay(true)
        setAction(() => modalAction);
    }

    const profileOptions = [
        {
            text: addProfileText,
            action: () => openModal('Lägg till ny profil', addProfile)
        },
        {
            text: renameProfileText,
            action: () => openModal('Ändra namn för profil', renameProfile)
        },
        {
            text: cloneProfileText,
            action: () => openModal('Skapa kopia av profil', cloneProfile)
        },
        {
            text: deleteProfileText,
            action: deleteProfile
        }
    ];

    const otherOptions = [
        { text: autoSelectRaceText, action: autoSelectRace },
        { text: autoFillText, action: autoFill },
        { text: clearFormText, action: clearForm },
        { text: 'TEST', action: test }
    ];

    return ([
        <NameModal title={title} action={action()} display={display} setDisplay={setDisplay} />,
        <Collapsable collapsedText='Profil alternativ' children={profileOptions} />,
        <Collapsable collapsedText='Beräkna egenskaper' children={otherOptions} />
    ])
}


export default Options;