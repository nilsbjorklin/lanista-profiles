import { createSignal, type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import { useProfile } from '../contexts/ProfileProvider';
import AttributeDisplayModal from './AttributeDisplayModal';
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
    const [displayName, setDisplayName] = createSignal(false);
    const [action, setAction] = createSignal((name: string) => { });

    const [displayAutoSelect, setDisplayAutoSelect] = createSignal(false);

    const addProfile = useProfile()?.addProfile as (name: string) => void;
    const renameProfile = useProfile()?.renameProfile as (name: string) => void;
    const cloneProfile = useProfile()?.cloneProfile as (name: string) => void;
    const deleteProfile = useProfile()?.deleteProfile;
    const autoFill = useFields()?.attributes.autoFill;
    const clearForm = useFields()?.attributes.clearForm;

    const profileOptions = [
        {
            text: addProfileText,
            action: () => openSelectNameModal('Lägg till ny profil', addProfile)
        },
        {
            text: renameProfileText,
            action: () => openSelectNameModal('Ändra namn för profil', renameProfile)
        },
        {
            text: cloneProfileText,
            action: () => openSelectNameModal('Skapa kopia av profil', cloneProfile)
        },
        {
            text: deleteProfileText,
            action: deleteProfile
        }
    ];

    function openSelectNameModal(modalTitle: string, modalAction: (name: string) => void) {
        setTitle(modalTitle);
        setDisplayName(true)
        setAction(() => modalAction);
    }

    const otherOptions = [
        { text: autoSelectRaceText, action: () => setDisplayAutoSelect(true) },
        { text: autoFillText, action: autoFill },
        { text: clearFormText, action: clearForm }
    ];

    return ([
        <AttributeDisplayModal title='Beräknade raser' display={displayAutoSelect} setDisplay={setDisplayAutoSelect} />,
        <NameModal title={title} action={action()} display={displayName} setDisplay={setDisplayName} />,
        <Collapsable collapsedText='Profil alternativ' children={profileOptions} />,
        <Collapsable collapsedText='Beräkna egenskaper' children={otherOptions} />
    ])
}


export default Options;