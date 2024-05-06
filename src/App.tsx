import { createMemo, createEffect, type Component } from 'solid-js';
import { LayoutProvider } from './LayoutProvider';
import Header from './Header';
import Content from './Content';
import { RaceType, UsedAttribute } from './data/Types'
import AttributesCalculator from './AttributesCalculator';
import ProfileHandler from './ProfileHandler';

const App: Component = () => {
    const { setProfiles, profileId, profileList, getActiveProfile, profileActions } = ProfileHandler();
    const { attributes, setAttribute, attributesTotal, attributeActions } = AttributesCalculator(getActiveProfile, setProfiles);
    const race: () => RaceType = createMemo(() => getActiveProfile().race);
    const usedAttributes: () => UsedAttribute[] = createMemo(() => getActiveProfile().usedAttributes, [], { equals: (prev, next) => prev.equals(next) });

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
    
    return (
        <LayoutProvider>
            <Container>
                <Header
                    profileId={profileId()}
                    profileList={profileList()}
                    race={race()}
                    setRace={setRace}
                    usedAttributes={usedAttributes()}
                    setUsedAttributes={setUsedAttributes}
                    switchProfile={profileActions.switchProfile}
                    addProfile={profileActions.addProfile}
                    renameProfile={profileActions.renameProfile}
                    cloneProfile={profileActions.cloneProfile}
                    deleteProfile={profileActions.deleteProfile}
                    autoSelectRace={attributeActions.autoSelectRace}
                    autoFill={attributeActions.autoFill}
                    clearForm={attributeActions.clearForm} />
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
