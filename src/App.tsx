import { type Component } from 'solid-js';

import { LayoutProvider } from './contexts/LayoutProvider';
import { ProfileProvider, useProfile } from './contexts/ProfileProvider';

import Container from './Container';
import { FieldsProvider } from './contexts/FieldsProvider';
import { Profile } from './data/Types';

const App: Component = () => {

    return (
        <LayoutProvider>
            <ProfileProvider>
                <FieldsProvider getProfile={useProfile()?.getProfile as () => Profile} setProfile={useProfile()?.setProfile as (value: (prev: Profile) => Profile) => void} >
                    <Container />
                </FieldsProvider>
            </ProfileProvider>
        </LayoutProvider>
    );
};

export default App;
