import { type Component } from 'solid-js';

import { LayoutProvider } from './contexts/LayoutProvider';
import { ProfileProvider } from './contexts/ProfileProvider';

import Container from './Container';
import { FieldsProvider } from './contexts/FieldsProvider';

const App: Component = () => {

    return (
        <LayoutProvider>
            <ProfileProvider>
                <FieldsProvider >
                    <Container />
                </FieldsProvider>
            </ProfileProvider>
        </LayoutProvider>
    );
};

export default App;
