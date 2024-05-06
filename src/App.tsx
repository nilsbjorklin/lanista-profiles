import { createSignal, createMemo, createEffect, type Component, MemoOptions } from 'solid-js';
import { LayoutProvider, useLayout } from './LayoutProvider';
import Header from './Header';
import Content from './Content';
import ProfilesSource from './data/profiles.json';
import compareObjects from './compareObjects';
import { Profile, Profiles, Race, UsedAttribute } from './data/Types'

const App: Component = () => {
    const [profiles, setProfiles] = createSignal<Profiles>((ProfilesSource as Profiles));
    const profileId: () => string = createMemo(() => profiles().active);
    const profileList: () => { [key: string]: string } = createMemo(() => getProfileList(), {}, { equals: (prev, next) => compareObjects(prev, next) });
    const race: () => Race = createMemo(() => getActiveProfile().race);
    const usedAttributes: () => UsedAttribute[] = createMemo(() => getActiveProfile().usedAttributes, [], { equals: (prev, next) => prev.equals(next) });
    const attributes = createMemo(() => getActiveProfile().attributes, {}, { equals: (prev, next) => compareObjects(prev, next) });
    const strength = createMemo(() => getActiveProfile().attributes.strength, [], { equals: (prev, next) => (prev && next) ? prev.equals(next) : false });


    function getActiveProfile() {
        return profiles().profiles[profiles().active]
    }

    function getProfileList(): { [key: string]: string } {
        let result: { [key: string]: string } = {};
        Object.keys(profiles().profiles).forEach(id => result[id] = profiles().profiles[id].name);
        return result;
    }

    function setProfileId(profileId: string): void {
        setProfiles((prev) => {
            prev.active = profileId
            return structuredClone(prev);
        })
    }

    function setRace(race: Race): void {
        setProfiles((prev) => {
            prev.profiles[prev.active].race = race
            return structuredClone(prev);
        })
    }

    function setUsedAttributes(usedAttributes: UsedAttribute[]): void {
        setProfiles((prev) => {
            prev.profiles[prev.active].usedAttributes = usedAttributes
            return structuredClone(prev);
        })
    }
    createEffect(() => {
        console.log('TRIGGER attributes');
        console.log(attributes());
    })
    createEffect(() => {
        console.log('TRIGGER strength');
        console.log(strength());
    })

    createEffect(() => {
        console.log('TRIGGER usedAttributes');
        console.log(usedAttributes());
    })
    createEffect(() => {
        console.log('TRIGGER race');
        console.log(race());
    })
    createEffect(() => {
        console.log('TRIGGER profileList');
        console.log(profileList());
    })

    return (
        <LayoutProvider>
            <Container>
                <Header
                    profileId={profileId()}
                    setProfileId={setProfileId}
                    profileList={profileList()}
                    race={race()}
                    setRace={setRace}
                    usedAttributes={usedAttributes()}
                    setUsedAttributes={setUsedAttributes} />
                <Content
                    race={race()}
                    usedAttributes={usedAttributes()}
                    attributes={attributes()}
                />
            </Container>
        </LayoutProvider>
    );
};


const Container: Component<{ children: any[] }> = (props) => {
    return (
        <div class='flex flex-col bg-dark text-light sm:w-screen md:w-[600px] lg:w-[80vw] w-[1120px]'>
            {props.children}
        </div>
    );
}

export default App;
