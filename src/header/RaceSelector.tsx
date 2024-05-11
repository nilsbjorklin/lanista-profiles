import { type Component } from 'solid-js';
import { useFields } from '../contexts/FieldsProvider';
import { RaceNames } from '../data/Types';
import { ChildButton, Selector } from './Components';

const RaceSelector: Component<{}> = () => {
    const race = useFields()?.race as () => RaceType;
    const setRace = useFields()?.setRace as (race: RaceType) => void;

    let children:ChildButton[] = Object.keys(RaceNames).map(race => {return {text:RaceNames[race as RaceType], action: () => setRace(race as RaceType)}})

    return (
        <Selector text={RaceNames[race()]} children={children} />
    )
}


export default RaceSelector;