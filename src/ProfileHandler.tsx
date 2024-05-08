import { Accessor, Setter, createSignal } from 'solid-js';
import { Profile } from './data/Types';
import { uniqueId } from './supportFunctions';
import compareObjects from './compareObjects';

export type ProfileList = {
    selected: string,
    profiles: {
        [key: string]: string
    };
}
export default class ProfileHandler {
    private profiles: Map<string, Profile> = new Map();
    private activeProfile: [Accessor<Profile>, Setter<Profile>];

    public constructor(profiles: Profile[]) {
        profiles.forEach(profile => this.profiles.set(profile.id, profile));
        this.activeProfile = createSignal(profiles[0]);
    }

    getProfile = (): Profile => {
        if (!this)
            throw new Error("")
        return this.activeProfile[0]();
    }

    switchProfile = (profileId: string): void => {
        if (!this)
            throw new Error("")
        let profile = this.profiles.get(profileId);
        if (profile) {
            this.activeProfile[1](profile);
        }
    }

    addProfile = (name: string) => {
        const newId = uniqueId();
        this.profiles.set(newId, {
            id: newId,
            name,
            race: 'human',
            usedAttributes: [],
            attributes: {},
            equipment: {},
            target: {}
        });
        this.switchProfile(newId);
    }

    renameProfile = (name: string) => {
        this.activeProfile[1]((prev) => {
            let profile: Profile = structuredClone(prev)
            profile.name = name;
            return profile;
        })
    }

    cloneProfile = (name: string) => {
        const newId = uniqueId();
        this.setProfile((prev) => {
            prev.name = name;
            this.profiles.set(newId, prev)
            return prev;
        });
    }

    deleteProfile = () => {
        this.setProfile((prev) => {
            this.profiles.delete(prev.id);
            return this.profiles.entries().next().value[1]
        });
    }

    setProfile = (value: (prev: Profile) => Profile): void => {
        let currentProfile = this.getProfile();
        let newProfile = value(structuredClone(this.getProfile()));
        if (!compareObjects(currentProfile, newProfile)) {
            this.activeProfile[1](newProfile);
        }
    }

    profileList = (): ProfileList => {
        if (!this)
            throw new Error("")
        let result: ProfileList = {
            selected: this.getProfile().name,
            profiles: {}
        };
        this.profiles.forEach((value: Profile, key: string) => {
            if (value.id !== this.getProfile().id)
                result.profiles[key] = value.name
        });
        return result;
    }
}