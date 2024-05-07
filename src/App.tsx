import { createMemo, type Component } from 'solid-js';
import { LayoutProvider } from './LayoutProvider';

import compareObjects from './compareObjects';
import { RaceType, Stat, UsedAttribute } from './data/Types';
import RaceData from './data/raceData.json';

import AttributesCalculator from './AttributesCalculator';
import ProfileHandler from './ProfileHandler';

import Header from './header/Header';
import Options from './header/Options';
import ProfileSelector from './header/ProfileSelector';
import RaceSelector from './header/RaceSelector';
import Weapons from './header/Weapons';

import TargetValues from './TargetValues';
import Content from './content/Content';
import ContentData from './content/ContentData';
import ContentHeader from './content/ContentHeader';

const baseStats: Stat[] = ['health', 'strength', 'endurance', 'initiative', 'dodge'];

type Races = {
    [key in RaceType]: {
        name: string;
        stats: {
            [key in Stat]: number
        }
    }
}
type Modifier = {
    [key in Stat]?: number
}

const App: Component = () => {
    const { setProfiles, profileId, profileList, getActiveProfile, profileActions } = ProfileHandler();
    const { attributes, setAttribute, attributesTotal, attributeActions } = AttributesCalculator(getActiveProfile, setProfiles);
    const { target, setTarget } = TargetValues(getActiveProfile, setProfiles);

    const race: () => RaceType = createMemo(() => getActiveProfile().race);
    const usedAttributes: () => UsedAttribute[] = createMemo(() => getActiveProfile().usedAttributes, [], { equals: (prev, next) => prev.equals(next) });

    const usedStats: () => Stat[] = createMemo(() => getUsedStats(), {}, { equals: (prev, next) => prev.equals(next) });
    const modifiers: () => Modifier = createMemo(() => getModifiers(), {}, { equals: (prev, next) => compareObjects(prev, next) });

    function getModifiers(): Modifier {
        let result: Modifier = {};
        usedStats().forEach(stat => {
            result[stat] = (RaceData as Races)[race()].stats[stat];
        })
        return result;
    }

    function getUsedStats(): Stat[] {
        return baseStats.concat(usedAttributes().filter(attr => attr !== '2h') as Stat[]);
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
                <Content>
                    <ContentHeader
                        usedStats={usedStats}
                        modifiers={modifiers} />
                    <ContentData
                        usedStats={usedStats}
                        modifiers={modifiers}
                        attributes={attributes()}
                        setAttribute={setAttribute}
                        attributesTotal={attributesTotal()}
                        target={target()}
                        setTarget={setTarget} />
                </Content>
            </Container>
        </LayoutProvider>
    );
};

export default App;
