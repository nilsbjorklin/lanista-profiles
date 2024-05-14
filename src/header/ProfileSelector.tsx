import { createMemo, type Component } from 'solid-js';
import { ProfileList, useProfile } from '../contexts/ProfileProvider';
import { ChildButton, Selector } from './Components';

const ProfileSelector: Component<{}> = () => {
    let switchProfile = useProfile()?.switchProfile;
    const profileList = useProfile()?.profileList as () => ProfileList;

    const getProfiles = (): ChildButton[] => {
        let result = profileList()?.profiles?.map(profile => {
            return { text: profile.name, action: () => switchProfile?.(profile.id) }
        }) ?? [];
        return result;
    }

    let children = createMemo(getProfiles);

    return (
        <Selector
            label='Profil:'
            text={profileList()?.selected.name ?? ''}>
            {children()}
        </Selector>
    )
}

export default ProfileSelector;