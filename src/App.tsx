import { createMemo, type Component } from 'solid-js';
import { LayoutProvider } from './LayoutProvider';
import Header from './header/Header';
import Content from './content/Content';
import { RaceType, UsedAttribute } from './data/Types'
import AttributesCalculator from './AttributesCalculator';
import ProfileHandler from './ProfileHandler';
import ProfileSelector from './header/ProfileSelector';
import RaceSelector from './header/RaceSelector';
import Options from './header/Options';
import Weapons from './header/Weapons';

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

    const Container: Component<{ children: any[] }> = (props) => {
        return (
            <div class='flex flex-col bg-dark text-light sm:w-screen md:w-[600px] lg:w-[80vw] w-[1120px]'>
                {props.children}
            </div>
        );
    }

    return (
        <LayoutProvider>
            <Container>
                <Header>
                    <ProfileSelector
                        profileId={profileId()}
                        profileList={profileList()}
                        switchProfile={profileActions.switchProfile} />
                    <RaceSelector
                        race={race()}
                        setRace={setRace} />
                    <Options
                        addProfile={profileActions.addProfile}
                        renameProfile={profileActions.renameProfile}
                        cloneProfile={profileActions.cloneProfile}
                        deleteProfile={profileActions.deleteProfile}
                        autoSelectRace={attributeActions.autoSelectRace}
                        autoFill={attributeActions.autoFill}
                        clearForm={attributeActions.clearForm} />
                    <Weapons
                        usedAttributes={usedAttributes()}
                        setUsedAttributes={setUsedAttributes} />
                </Header>
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

export default App;
