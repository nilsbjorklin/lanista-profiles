import { createSignal, createMemo, createEffect, type Component } from 'solid-js';
import { LayoutProvider } from './LayoutProvider';
import Header from './Header';
import Content from './Content';
import ProfilesSource from './data/profiles.json';
import compareObjects from './compareObjects';
import { Stat, Profiles, RaceType, UsedAttribute, Attributes } from './data/Types'

const App: Component = () => {
    const [profiles, setProfiles] = createSignal<Profiles>((ProfilesSource as Profiles));
    const profileId: () => string = createMemo(() => profiles().active);
    const profileList: () => { [key: string]: string } = createMemo(() => getProfileList(), {}, { equals: (prev, next) => compareObjects(prev, next) });
    const race: () => RaceType = createMemo(() => getActiveProfile().race);
    const usedAttributes: () => UsedAttribute[] = createMemo(() => getActiveProfile().usedAttributes, [], { equals: (prev, next) => prev.equals(next) });
    const attributes = createMemo(() => getActiveProfile().attributes, {}, { equals: (prev, next) => compareAttributes(prev, next) });
    const [attributesTotal, setAttributesTotal] = createSignal<Attributes>(setInitialAttributesTotal());

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

    function setRace(race: RaceType): void {
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

    function compareAttributes(prev: Attributes, next: Attributes): boolean {
        let prevKeys = Object.keys(prev) as Stat[];
        let nextKeys = Object.keys(next) as Stat[];

        if (!prevKeys.equals(nextKeys)) {
            return false;
        }
        let result = true;

        prevKeys.forEach(stat => {
            let prevStat = prev[stat] as number[];
            let nextStat = next[stat] as number[];
            if (!prevStat.equals(nextStat)) {
                updateAttributesTotal(stat, nextStat);
                result = false;
            }
        })
        return result;
    }

    function updateAttributesTotal(stat: Stat, value: number[]) {
        console.log('Updating total for stat: ' + stat);
        setAttributesTotal((prev) => {
            prev[stat] = getAttributesTotal(stat, value);
            return structuredClone(prev);
        })
    }

    function getAttributesTotal(stat: Stat, value: number[]) {
        let result: number[] = Array(value.length);
        let total: number = 0;
        value.forEach((value, index) => {
            result[index] = value + total;
            total += value;
        })
        return result;
    }

    function setInitialAttributesTotal() {
        let result: Attributes = {}
        Object.keys(attributes()).forEach(stat => {
            result[stat as Stat] = getAttributesTotal(stat as Stat, attributes()[stat as Stat] ?? []);
        })

        return result;
    }

    function setAttribute(stat: Stat, index: number, value: number): void {
        setProfiles((prev) => {
            let profiles = structuredClone(prev);
            profiles.profiles[profiles.active].attributes[stat] = profiles.profiles[profiles.active].attributes[stat] ?? Array(index).fill(0);

            if ((profiles.profiles[profiles.active].attributes[stat] as number[]).length <= index) {
                let length = (profiles.profiles[profiles.active].attributes[stat] as number[]).length;
                profiles.profiles[profiles.active].attributes[stat] = (profiles.profiles[profiles.active].attributes[stat] as number[]).concat(Array(index - length).fill(0))
            }

            (profiles.profiles[profiles.active].attributes[stat] as number[])[index] = value;

            return structuredClone(profiles);
        })
    }

    createEffect(() => {
        console.log('TRIGGER attributesTotal');
        console.log(attributesTotal());
    })
    createEffect(() => {
        console.log('TRIGGER attributes');
        console.log(attributes());
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
                    setAttribute={setAttribute}
                    attributesTotal={attributesTotal()}
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
