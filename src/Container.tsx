import { type Component } from 'solid-js';

import AttributesAndStats from './AttributesAndStats';
import AttributesCalculator from './AttributesCalculator';
import TargetAndEquipment from './TargetAndEquipment';

import Header from './header/Header';
import Options from './header/Options';
import ProfileSelector from './header/ProfileSelector';
import RaceSelector from './header/RaceSelector';
import Weapons from './header/Weapons';

import Content from './content/Content';
import ContentData from './content/ContentData';
import ContentHeader from './content/ContentHeader';
import { Profile, RaceType } from './data/Types';

import { useProfile } from './contexts/ProfileProvider';
import { useFields } from './contexts/FieldsProvider';

const Container: Component = () => {
    const test = useFields()?.test as () => void;
    const { target } = TargetAndEquipment();
    const { attributesTotal, attributeActions } = AttributesAndStats();
    const { autoFill } = AttributesCalculator(target.totalTarget)

    return (
        <div class='flex flex-col bg-dark text-light sm:w-screen md:w-[600px] lg:w-[80vw] w-[1120px]'>
            <Header>
                <ProfileSelector />
                <RaceSelector />
                <Options
                    autoSelectRace={attributeActions.autoSelectRace}
                    autoFill={autoFill}
                    clearForm={attributeActions.clearForm}
                    testFunction={test} />
                <Weapons />
            </Header>
            <Content>
                <ContentHeader />
                <ContentData
                    attributesTotal={attributesTotal()}
                    target={{ manual: target.manualTarget(), equipment: target.equipmentTarget(), total: target.totalTarget() }}
                />
            </Content>
        </div>
    );
}

export default Container;
