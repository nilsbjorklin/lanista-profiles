import { type Component } from 'solid-js';

import AttributesCalculator from './AttributesCalculator';
import CalculateTarget from './CalculateTarget';

import Header from './header/Header';
import Options from './header/Options';
import ProfileSelector from './header/ProfileSelector';
import RaceSelector from './header/RaceSelector';
import Weapons from './header/Weapons';

import Content from './content/Content';
import ContentData from './content/ContentData';
import ContentHeader from './content/ContentHeader';

import { useFields } from './contexts/FieldsProvider';

const Container: Component = () => {
    const test = useFields()?.test as () => void;
    const { target } = CalculateTarget();
    const { autoFill, autoSelectRace } = AttributesCalculator(target.totalTarget)

    return (
        <div class='flex flex-col bg-dark text-light sm:w-screen md:w-[600px] lg:w-[80vw] w-[1120px]'>
            <Header>
                <ProfileSelector />
                <RaceSelector />
                <Options
                    autoSelectRace={autoSelectRace}
                    autoFill={autoFill}
                    testFunction={test} />
                <Weapons />
            </Header>
            <Content>
                <ContentHeader />
                <ContentData
                    target={{ manual: target.manualTarget(), equipment: target.equipmentTarget(), total: target.totalTarget() }}
                />
            </Content>
        </div>
    );
}

export default Container;
