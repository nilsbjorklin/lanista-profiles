import { createSignal, createEffect, createContext, onCleanup, onMount, useContext } from "solid-js";

const LayoutContext = createContext<{ desktop: () => boolean, size: () => Size, textSize: () => string }>();

export function useLayout() {
    return useContext(LayoutContext);
}

enum Size {
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
    XL = 'xl',

}

export function LayoutProvider(props: { children: any }) {
    const [desktop, setDesktop] = createSignal(window.innerWidth > 600);
    // sm less than 600, md less than 900, lg less than 1200, xl larger or equal to 1200
    const [size, setSize] = createSignal(window.innerWidth < 600 ? Size.SM : (window.innerWidth < 950 ? Size.MD : (window.innerWidth < 1200 ? Size.LG : Size.XL)));
    const [textSize, setTextSize] = createSignal('text-sm');

    const handler = () => {
        let width = window.innerWidth;
        setDesktop(width > 600);
        setSize(window.innerWidth < 600 ? Size.SM : (window.innerWidth < 950 ? Size.MD : (window.innerWidth < 1200 ? Size.LG : Size.XL)));
    };

    createEffect(() => {
        switch (size()) {
            case 'md':
                setTextSize('text-sm')
                break;
            default:
                setTextSize('text-md')
        }
    });

    onMount(() => {
        window.addEventListener('resize', handler);
    });

    onCleanup(() => {
        window.removeEventListener('resize', handler);
    })


    return (
        <LayoutContext.Provider value={{ desktop, size, textSize }}>
            {props.children}
        </LayoutContext.Provider>
    );
}