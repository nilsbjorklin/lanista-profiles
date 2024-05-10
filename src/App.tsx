import { type Component } from 'solid-js';

import { LayoutProvider } from './contexts/LayoutProvider';
import { ProfileProvider } from './contexts/ProfileProvider';

import Container from './Container';
import { FieldsProvider } from './contexts/FieldsProvider';
import { AttributesProvider } from './contexts/AttributesProvider';

const App: Component = () => {

    return (
        <LayoutProvider>
            <ProfileProvider>
                <FieldsProvider >
                    <AttributesProvider>
                        <Container />
                    </AttributesProvider>
                </FieldsProvider>
            </ProfileProvider>
        </LayoutProvider>
    );
};

export default App;
