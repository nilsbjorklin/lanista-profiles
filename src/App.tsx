import { type Component } from 'solid-js';

import { LayoutProvider } from './LayoutProvider';
import { ProfileProvider } from './ProfileProvider';

import Container from './Container';

const App: Component = () => {

    return (
        <LayoutProvider>
            <ProfileProvider>
                <Container />
            </ProfileProvider>
        </LayoutProvider>
    );
};

export default App;
