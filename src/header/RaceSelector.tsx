import { Index, type Component } from 'solid-js';
import { RaceType } from '../data/Types'
import { HeaderButton, Selector } from './Components'

const Races: { [key in RaceType]: string } = {
    human: 'Människa',
    elf: 'Alv',
    dwarf: 'Dvärg',
    orc: 'Ork',
    troll: 'Troll',
    goblin: 'Goblin',
    undead: 'Odöd',
    salamanther: 'Salamanther'
}

const RaceSelector: Component<{
    race: RaceType,
    setRace: ((prev: RaceType) => void)
}> = (props) => {

    return (
        <Selector text={Races[props.race]} size={80}>
            <Index each={Object.keys(Races)}>
                {race => <HeaderButton text={Races[race() as RaceType]} action={() => props.setRace(race() as RaceType)} />}
            </Index>
        </Selector>
    )
}


export default RaceSelector;