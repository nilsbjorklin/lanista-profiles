import { createSignal, createMemo } from 'solid-js';
import ProfilesSource from './data/profiles.json';
import compareObjects from './compareObjects';
import { Profiles } from './data/Types';
import { uniqueId } from './supportFunctions';

export default function ProfileHandler() {
    const [profiles, setProfiles] = createSignal<Profiles>((ProfilesSource as Profiles));
    const profileId: () => string = createMemo(() => profiles().active);
    const profileList: () => { [key: string]: string } = createMemo(() => getProfileList(), {}, { equals: (prev, next) => compareObjects(prev, next) });

    function getActiveProfile() {
        return profiles().profiles[profiles().active]
    }

    function getProfileList(): { [key: string]: string } {
        let result: { [key: string]: string } = {};
        Object.keys(profiles().profiles).forEach(id => result[id] = profiles().profiles[id].name);
        return result;
    }

    function switchProfile(profileId: string): void {
        setProfiles((prev) => {
            prev.active = profileId
            return structuredClone(prev);
        })
    }

    function addProfile(name: string) {
        const newId = uniqueId();
        setProfiles((prev) => {
            prev.profiles[newId] = {
                name,
                race: 'human',
                usedAttributes: [],
                attributes: {},
                equipment: {},
                target: {}
            }
            prev.active = newId
            return structuredClone(prev);
        })
    }

    function renameProfile(name: string) {
        setProfiles((prev) => {
            prev.profiles[prev.active].name = name;
            return structuredClone(prev);
        })
    }

    function cloneProfile(name: string) {
        const newId = uniqueId();
        setProfiles((prev) => {
            let profile = structuredClone(prev.profiles[prev.active])
            profile.name = name;
            prev.profiles[newId] = profile;
            prev.active = newId;
            return structuredClone(prev);
        })
    }

    function deleteProfile() {
        setProfiles((prev) => {
            let result: Profiles = {
                active: '',
                profiles: {}
            };
            Object.keys(prev.profiles)
                .filter((profileId) => profileId !== prev.active)
                .forEach(profileId => result.profiles[profileId] = prev.profiles[profileId]);
            result.active = Object.keys(result.profiles)[0];
            return result;
        })
    }

    return { setProfiles, profileId, profileList, getActiveProfile, profileActions: { switchProfile, addProfile, renameProfile, cloneProfile, deleteProfile } }

}