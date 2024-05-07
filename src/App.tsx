import { type Component } from 'solid-js';
import { LayoutProvider } from './LayoutProvider';

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
import StatsAndModifiers from './StatsAndModifiers';

const App: Component = () => {
    const { setProfiles, profileId, profileList, getActiveProfile, profileActions } = ProfileHandler();
    const { attributes, setAttribute, attributesTotal, attributeActions } = AttributesCalculator(getActiveProfile, setProfiles);
    const { target, setTarget } = TargetValues(getActiveProfile, setProfiles);
    const { race, setRace, usedAttributes, setUsedAttributes, usedStats, modifiers } = StatsAndModifiers(getActiveProfile, setProfiles);

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
