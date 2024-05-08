import { createContext, createEffect, createSignal, useContext } from "solid-js";
import { Profile } from "./data/Types";
import { uniqueId } from "./supportFunctions";
import compareObjects from "./compareObjects";

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
        throw new Error('ProfileList not found in storage');
    }

    function getProfile(): Profile {
        if (profileList()) {
            let storageProfile = localStorage.getItem(profileList().selected.id);
            if (storageProfile) {
                return JSON.parse(storageProfile) as Profile
            } else {
                throw new Error('Active profile not found in storage');
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
                    target: {}
                }))
                return { selected: newSelected, profiles: newProfiles };
            }
            throw new Error("Could not add profile!");
        })
    }

    const renameProfile = (name: string) => {
        setProfileList((prev) => {
            prev.selected.name = name;
            return structuredClone(prev);
        });
    }

    const cloneProfile = (name: string) => {
        console.log('cloneProfile: ' + name);
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
        console.log('deleteProfile');
        setProfileList((prev) => {
            if (prev.profiles.length !== 0) {
                localStorage.removeItem(prev.selected.id);
                return { selected: prev.profiles[0], profiles: prev.profiles.length !== 1 ? prev.profiles.slice(1) : [] };
            }
            //window.confirm('Cannot delete the only profile! Create new profile before deleting.')
            throw new Error("Cannot delete the only profile!");
        })
    }


    createContext(() => {
        console.log('createContext()');
        console.log('profileList()');
        console.log(profileList());

        if (profileList()) {
            let storageProfile = localStorage.getItem(profileList().selected.id);
            if (storageProfile) {
                let profileJson = JSON.parse(storageProfile) as Profile;
                setActiveProfile(profileJson);
            } else {
                throw new Error('Active profile not found in storage');
            }
        } else {
            throw new Error('ProfileList not found');
        }
    })

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