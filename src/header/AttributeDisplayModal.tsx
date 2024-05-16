import { Index, createMemo, type Component } from 'solid-js';
import Modal from '../Modal';
import compareObjects from '../compareObjects';
import Row from '../content/Row';
import RowCell from '../content/RowCell';
import RowLabel from '../content/RowLabel';
import { useFields } from '../contexts/FieldsProvider';
import { RaceNames } from '../data/Types';

const EquipmentModal: Component<{
    title: string,
    display: () => boolean,
    setDisplay: (display: boolean) => void
}> = (props) => {
    const autoSelectRace = useFields()?.attributes.autoSelectRace as () => { levels: number[], health: { [key in RaceType]?: Record<string, string> | undefined }, values: { [key in RaceType]?: Attributes } };
    const setAttributes = useFields()?.attributes.set as (value: (prev: Attributes) => Attributes) => void;
    const setRace = useFields()?.setRace as (race: RaceType) => void;
    let calculatedAttributes = createMemo(() => autoSelectRace() ?? { levels: [], health: {} }, {}, { equals: (prev, next) => compareObjects(prev, next) });

    const selectRace = (race: RaceType) => {
        setRace(race);
        setAttributes(() => calculatedAttributes()?.values?.[race] as Attributes);
        props.setDisplay(false);
    }
    return (
        <Modal
            title={props.title}
            bodyClass='grid grid-flow-row auto-cols-fr overflow-y-scroll scrollbar-none sm:text-sm'
            display={props.display}
            setDisplay={props.setDisplay}>

            <Row>
                <RowLabel class='border-b'>Välj Ras</RowLabel>
            </Row>
            <Row>
                <RowLabel>Grad</RowLabel>
                <Index each={calculatedAttributes().levels}>
                    {value =>
                        <RowCell class='font-bold' >
                            {value()}
                        </RowCell>
                    }
                </Index>
            </Row>
            <Index each={Object.keys(RaceNames)}>
                {race =>
                    <Row
                        onClick={calculatedAttributes().health[race() as RaceType] ? () => selectRace(race() as RaceType) : undefined}
                        class='border-t'>
                        <RowLabel class={calculatedAttributes().health[race() as RaceType] ? '' : 'text-red'}>
                            {RaceNames[race() as RaceType]}
                        </RowLabel>
                        <Index each={calculatedAttributes().levels}>
                            {value =>
                                <RowCell>
                                    {calculatedAttributes().health[race() as RaceType]?.[value()] ?? 'N/A'}
                                </RowCell>
                            }
                        </Index>
                    </Row>
                }
            </Index>
        </Modal>
    )
}

export default EquipmentModal;