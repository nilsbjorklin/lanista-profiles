import { type Component } from 'solid-js';

import Header from './header/Header';
import Options from './header/Options';
import ProfileSelector from './header/ProfileSelector';
import RaceSelector from './header/RaceSelector';
import Weapons from './header/Weapons';

import Content from './content/Content';
import ContentData from './content/ContentData';
import ContentHeader from './content/ContentHeader';


const Container: Component = () => {

    return (
        <div class='flex flex-col bg-dark text-light sm:w-screen md:w-[600px] lg:w-[80vw] w-[1120px] sm:text-sm'>
            <Header>
                <ProfileSelector />
                <RaceSelector />
                <div class='hidden w-full sm:block' />
                <Options />
                <div class='w-full sm:hidden' />
                <Weapons />
            </Header>
            <Content>
                <ContentHeader />
                <ContentData />
            </Content>
        </div>
    );
}

export default Container;
