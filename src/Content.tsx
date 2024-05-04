import { For, createEffect, createSignal, type Component } from 'solid-js';
import { useLayout } from './LayoutProvider';


const addProfileText = 'Lägg till ny profil';
const renameProfileText = 'Byt namn på profil';
const cloneProfileText = 'Skapa kopia av profil';
const deleteProfileText = 'Radera profil';

const autoSelectRaceText = 'Välj ras och Fyll i värden';
const autoFillText = 'Fyll i värden';
const clearFormText = 'Rensa';

const baseStats = ['health', 'strength', 'endurance', 'initiative', 'dodge', 'maces']

const Content: Component<{ usedAttributes: string[]}> = (props)  => {
    const [usedStats, setUsedStats] = createSignal<string[]>(baseStats);
    const [modifiers, setModifiers] = createSignal<{ [key: string]: number }>({
        health: 1.2,
        strength: 1.1,
        endurance: 1.3,
        initiative: 0.5,
        dodge: 0.3,
        maces: 0.85
    });


    createEffect(() => {
        setUsedStats(baseStats.concat(props.usedAttributes))
    });

    return (
        <div class='flex flex-col border-black border'>
            <Row>
                <For each={usedStats()}>
                    {attribute => <div>{attribute}</div>}
                </For>
            </Row>
            <Row>
                <For each={usedStats()}>
                    {attribute => <div>{modifiers()[attribute]}%</div>}
                </For>
            </Row>
        </div>
    )
}

const Row: Component<{ children: any }> = (props) => {
    return (
        <div class='flex flex-row border-green-500 border justify-between'>
            {props.children}
        </div>
    )
}

export default Content;