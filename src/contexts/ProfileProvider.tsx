import { createContext, createEffect, createSignal, useContext } from "solid-js";
import compareObjects from "../compareObjects";

export type ProfileIdentifier = {
    id: string,
    name: string
}

export type ProfileList = {
    selected: ProfileIdentifier,
    profiles: ProfileIdentifier[];
}

const ProfileListKey = 'profile-list';

const ProfileContext = createContext<{
    profileList: () => ProfileList | undefined,
    getProfile: () => Profile | undefined,
    setProfile: (value: (prev: Profile) => Profile) => void,
    switchProfile: (name: string) => void,
    addProfile: (name: string) => void,
    renameProfile: (name: string) => void,
    cloneProfile: (name: string) => void,
    deleteProfile: () => void
}>();

export function useProfile() {
    return useContext(ProfileContext);
}

const uniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function ProfileProvider(props: { children: any }) {
    const [profileList, setProfileList] = createSignal<ProfileList>(getProfileList());
    const [activeProfile, setActiveProfile] = createSignal<Profile>(getProfile());

    createEffect(() => {
        console.log('save profile');
        localStorage.setItem(activeProfile().id, JSON.stringify(activeProfile()))
    })

    createEffect(() => {
        console.log('save profileList');
        setActiveProfile(getProfile());
        localStorage.setItem(ProfileListKey, JSON.stringify(profileList()))
    })

    function getProfileList(): ProfileList {
        let storageProfileList = localStorage.getItem(ProfileListKey);
        if (storageProfileList) {
            return JSON.parse(storageProfileList) as ProfileList
        }
        console.error('ProfileList not found in storage');
        return { selected: { id: uniqueId(), name: 'Standard' }, profiles: [] };
    }

    function getProfile(): Profile {
        if (profileList()) {
            let storageProfile = localStorage.getItem(profileList().selected.id);
            if (storageProfile) {
                return JSON.parse(storageProfile) as Profile
            } else {
                console.error('Active profile not found in storage');
                return {
                    id: profileList().selected.id,
                    name: profileList().selected.name,
                    race: 'human',
                    usedAttributes: [],
                    attributes: {},
                    equipment: {},
                    target: { 1: {} }
                };
            }
        } else {
            throw new Error('ProfileList not found');
        }
    }

    function setProfile(value: (prev: Profile) => Profile): void {
        let newProfile = value(structuredClone(activeProfile()));
        if (!compareObjects(activeProfile(), newProfile)) {
            setActiveProfile(newProfile);
        }
    }

    function switchProfile(profileId: string): void {
        setProfileList((prev) => {
            let newSelected;
            let newProfiles: ProfileIdentifier[] = [prev.selected];
            prev.profiles.forEach(profile => {
                if (profile.id === profileId) {
                    newSelected = profile;
                } else {
                    newProfiles.push(profile);
                }
            })

            if (newSelected)
                return { selected: newSelected, profiles: newProfiles };

            throw new Error("Could not switch profile!");
        })
    }

    const addProfile = (name: string) => {
        console.log('addProfile');
        const newId = uniqueId();
        setProfileList((prev) => {
            let newSelected = {
                id: newId,
                name
            };
            let newProfiles: ProfileIdentifier[] = [prev.selected];
            getProfileList().profiles.forEach(profile => newProfiles.push(profile))
            if (newSelected) {
                localStorage.setItem(newId, JSON.stringify({
                    id: newId,
                    name,
                    race: 'human',
                    usedAttributes: [],
                    attributes: {},
                    equipment: {},
                    target: { 1: {} }
                }))
                return { selected: newSelected, profiles: newProfiles };
            }
            throw new Error("Could not add profile!");
        })
    }

    const renameProfile = (name: string) => {
        console.log('renameProfile');
        setProfileList((prev) => {
            console.log(name);
            prev.selected.name = name;
            return structuredClone(prev);
        });
    }

    const cloneProfile = (name: string) => {
        console.log('cloneProfile');

        const newId = uniqueId();
        setProfileList((prev) => {
            let newSelected = {
                id: newId,
                name
            };
            let newProfiles: ProfileIdentifier[] = [prev.selected];
            getProfileList().profiles.forEach(profile => newProfiles.push(profile))
            let profile = activeProfile()
            if (newSelected) {
                localStorage.setItem(newId, JSON.stringify({
                    id: newId,
                    name,
                    race: profile.race,
                    usedAttributes: profile.usedAttributes,
                    attributes: profile.attributes,
                    equipment: profile.equipment,
                    target: profile.target
                }))
                return { selected: newSelected, profiles: newProfiles };
            }
            throw new Error("Could not clone profile!");
        })

    }

    const deleteProfile = () => {
        if (window.confirm(`Är du säker att du vill ta bort profilen '${activeProfile().name}'?`)) {
            setProfileList((prev) => {
                if (prev.profiles.length !== 0) {
                    localStorage.removeItem(prev.selected.id);
                    return { selected: prev.profiles[0], profiles: prev.profiles.length !== 1 ? prev.profiles.slice(1) : [] };
                }
                throw new Error("Cannot delete the only profile!");
            })
        }
    }

    return (
        <ProfileContext.Provider value={{
            profileList,
            getProfile: activeProfile,
            setProfile: setProfile,
            switchProfile,
            addProfile,
            renameProfile,
            cloneProfile,
            deleteProfile
        }}>
            {props.children}
        </ProfileContext.Provider>
    );
}