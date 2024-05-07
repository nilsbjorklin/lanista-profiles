import { Index, type Component } from 'solid-js';
import { HeaderButton, Selector } from './Components'

const ProfileSelector: Component<{
    profileId: string,
    profileList: { [key: string]: string }
    switchProfile: ((prev: string) => void),
}> = (props) => {

    return (
        <Selector
            text={props.profileList[props.profileId]}
            size={Object.keys(props.profileList).map(id => props.profileList[id]).reduce((a, b) => a.length > b.length ? a : b).length * 10}>
            <Index each={Object.keys(props.profileList)}>
                {profileId => <HeaderButton text={props.profileList[profileId()]} action={() => props.switchProfile(profileId())} />}
            </Index>
        </Selector>
    )
}

export default ProfileSelector;