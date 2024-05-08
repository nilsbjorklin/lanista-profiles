import { type Component } from 'solid-js';

import AttributesCalculator from './AttributesCalculator';

import StatsAndModifiers from './StatsAndModifiers';
import TargetAndEquipment from './TargetAndEquipment';


import Header from './header/Header';
import Options from './header/Options';
import ProfileSelector from './header/ProfileSelector';
import RaceSelector from './header/RaceSelector';
import Weapons from './header/Weapons';

import Content from './content/Content';
import ContentData from './content/ContentData';
import ContentHeader from './content/ContentHeader';
import { useProfile } from './ProfileProvider';
import { Profile } from './data/Types';

const Container: Component = () => {
    let getProfile = useProfile()?.getProfile as () => Profile;
    let setProfile = useProfile()?.setProfile as (value: (prev: Profile) => Profile) => void;
    const { attributes, setAttribute, attributesTotal, attributeActions } = AttributesCalculator(getProfile, setProfile);
    const { target, setTarget, equipment } = TargetAndEquipment(getProfile, setProfile);
    const { race, setRace, usedAttributes, setUsedAttributes, usedStats, modifiers, twoHanded } = StatsAndModifiers(getProfile, setProfile);

    return (
        <div class='flex flex-col bg-dark text-light sm:w-screen md:w-[600px] lg:w-[80vw] w-[1120px]'>
            <Header>
                <ProfileSelector />
                <RaceSelector
                    race={race()}
                    setRace={setRace} />
                <Options
                    autoSelectRace={attributeActions.autoSelectRace}
                    autoFill={attributeActions.autoFill}
                    clearForm={attributeActions.clearForm}
                    testFunction={() => console.log(getProfile())} />
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
                    equipment={equipment()}
                    twoHanded={twoHanded()} />
            </Content>
        </div>
    );
}

export default Container;
