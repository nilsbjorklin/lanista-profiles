import { createSignal, createContext, onCleanup, onMount, useContext } from "solid-js";

const LayoutContext = createContext<{ desktop: () => boolean }>();

export function useLayout() {
    return useContext(LayoutContext);
}

export function LayoutProvider(props: { children: any }) {
    const [desktop, setDesktop] = createSignal(window.innerWidth > 600);

    const handler = () => {
        setDesktop(window.innerWidth > 600);
    };

    onMount(() => {
        window.addEventListener('resize', handler);
    });

    onCleanup(() => {
        window.removeEventListener('resize', handler);
    })


    return (
        <LayoutContext.Provider value={{desktop: desktop}}>
            {props.children}
        </LayoutContext.Provider>
    );
}