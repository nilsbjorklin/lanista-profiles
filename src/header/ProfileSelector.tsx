import { createMemo, type Component } from 'solid-js';
import { useProfile } from '../contexts/ProfileProvider';
import { ChildButton, Selector } from './Components';

const ProfileSelector: Component<{}> = () => {
    let switchProfile = useProfile()?.switchProfile;
    const profileList = useProfile()?.profileList();

    const getProfiles = (): ChildButton[] => {
        let result = useProfile()?.profileList()?.profiles?.map(profile => {
            return { text: profile.name, action: () => switchProfile?.(profile.id) } 
        }) ?? [];
        return result;
    }

    let children = createMemo(getProfiles);
    
    return (
        <Selector
            text={useProfile()?.profileList()?.selected.name ?? ''}>
            {children()}
        </Selector>
    )
}

export default ProfileSelector;