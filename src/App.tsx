import { type Component } from 'solid-js';
import { LayoutProvider } from './LayoutProvider';

import AttributesCalculator from './AttributesCalculator';

import ProfileHandler from './ProfileHandler';
import StatsAndModifiers from './StatsAndModifiers';
import TargetAndEquipment from './TargetAndEquipment';

import ProfilesSource from './data/profiles.json';
import { Profile } from './data/Types';

import Header from './header/Header';
import Options from './header/Options';
import ProfileSelector from './header/ProfileSelector';
import RaceSelector from './header/RaceSelector';
import Weapons from './header/Weapons';

import Content from './content/Content';
import ContentData from './content/ContentData';
import ContentHeader from './content/ContentHeader';

const App: Component = () => {
    const profiles = new ProfileHandler(ProfilesSource as Profile[]);
    const { attributes, setAttribute, attributesTotal, attributeActions } = AttributesCalculator(profiles.getProfile, profiles.setProfile);
    const { target, setTarget, equipment } = TargetAndEquipment(profiles.getProfile, profiles.setProfile);
    const { race, setRace, usedAttributes, setUsedAttributes, usedStats, modifiers } = StatsAndModifiers(profiles.getProfile, profiles.setProfile);

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
                        profileList={profiles.profileList()}
                        switchProfile={profiles.switchProfile} />
                    <RaceSelector
                        race={race()}
                        setRace={setRace} />
                    <Options
                        addProfile={profiles.addProfile}
                        renameProfile={profiles.renameProfile}
                        cloneProfile={profiles.cloneProfile}
                        deleteProfile={profiles.deleteProfile}
                        autoSelectRace={attributeActions.autoSelectRace}
                        autoFill={attributeActions.autoFill}
                        clearForm={attributeActions.clearForm}
                        testFunction={() => console.log(profiles.getProfile())} />
                    <Weapons
                        usedAttributes={usedAttributes()}
                        setUsedAttributes={setUsedAttributes} />
                </Header>
                <Content>
                    <ContentHeader
                        usedStats={usedStats}
                        modifiers={modifiers}
                        race={race()} />
                    <ContentData
                        usedStats={usedStats}
                        modifiers={modifiers}
                        attributes={attributes()}
                        setAttribute={setAttribute}
                        attributesTotal={attributesTotal()}
                        target={{ manual: target.manualTarget(), equipment: target.equipmentTarget(), total: target.totalTarget() }}
                        setTarget={setTarget}
                        equipment={equipment()} />
                </Content>
            </Container>
        </LayoutProvider>
    );
};

export default App;
