import { createSignal, type Component } from 'solid-js';
import { LayoutProvider } from './LayoutProvider';
import Header from './Header';
import Content from './Content';

const App: Component = () => {
    const [usedAttributes, setUsedAttributes] = createSignal<string[]>([]);

    return (
        <LayoutProvider>
            <Container>
                <Header
                    usedAttributes={usedAttributes()}
                    setUsedAttributes={value => setUsedAttributes(value)} />
                <Content
                    usedAttributes={usedAttributes()}
                />
            </Container>
        </LayoutProvider>
    );
};

const Container: Component<{ children: any[] }> = (props) => {
    return (
        <div class='flex justify-center h-screen bg-dark text-light'>
            <div class='sm:w-screen md:w-[600px] lg:w-[80vw] w-[1120px]'>
                {props.children}
            </div>
        </div>
    );
}

export default App;
