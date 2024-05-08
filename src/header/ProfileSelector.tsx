import { Index, type Component } from 'solid-js';
import { HeaderButton, Selector } from './Components'
import { ProfileList } from '../ProfileHandler';

const ProfileSelector: Component<{
    profileList: ProfileList
    switchProfile: ((prev: string) => void),
}> = (props) => {

    return (
        <Selector
            text={props.profileList.selected}
            size={Object.keys(props.profileList.profiles).map(id => props.profileList.profiles[id]).reduce((a, b) => a.length > b.length ? a : b).length * 10}>
            <Index each={Object.keys(props.profileList.profiles)}>
                {profileId => <HeaderButton text={props.profileList.profiles[profileId()]} action={() => props.switchProfile(profileId())} />}
            </Index>
        </Selector>
    )
}

export default ProfileSelector;