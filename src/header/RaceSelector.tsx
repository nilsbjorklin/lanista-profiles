import { Index, type Component } from 'solid-js';
import { RaceNames, RaceType } from '../data/Types'
import { HeaderButton, Selector } from './Components'
import { useFields } from '../contexts/FieldsProvider';

const RaceSelector: Component<{}> = (props) => {
    const race = useFields()?.race as () => RaceType;
    const setRace = useFields()?.setRace as (race: RaceType) => void;

    return (
        <Selector text={RaceNames[race()]} size={80}>
            <Index each={Object.keys(RaceNames)}>
                {race => <HeaderButton text={RaceNames[race() as RaceType]} action={() => setRace(race() as RaceType)} />}
            </Index>
        </Selector>
    )
}


export default RaceSelector;