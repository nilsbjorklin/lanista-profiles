import { Index, type Component } from 'solid-js';
import { HeaderButton, Selector } from './Components'
import { useProfile } from '../ProfileProvider';

const ProfileSelector: Component<{}> = () => {
    let switchProfile = useProfile()?.switchProfile;

    return (
        <Selector
            text={useProfile()?.profileList()?.selected.name ?? ''}
            size={(useProfile()?.profileList()?.profiles ?? []).map(profile => profile.name).reduce((a, b) => a.length > b.length ? a : b).length * 10}>
            <Index each={useProfile()?.profileList()?.profiles ?? []}>
                {profile => <HeaderButton text={profile().name} action={() => switchProfile?.(profile().id)} />}
            </Index>
        </Selector>
    )
}

export default ProfileSelector;