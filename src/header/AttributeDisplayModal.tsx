import { Index, createEffect, createMemo, type Component } from 'solid-js';
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
    const autoSelectRace = useFields()?.attributes.autoSelectRace as () => { levels: number[], highestRace: Record<string, RaceType>, health: { [key in RaceType]?: Record<string, number> | undefined }, values: { [key in RaceType]?: Attributes } };
    const setAttributes = useFields()?.attributes.set as (value: (prev: Attributes) => Attributes) => void;
    const setRace = useFields()?.setRace as (race: RaceType) => void;
    let calculatedAttributes = createMemo(() => autoSelectRace() ?? { levels: [], highestRace: {}, health: {} }, {}, { equals: (prev, next) => compareObjects(prev, next) });
    let health = createMemo(() => calculatedAttributes().health ?? {}, {}, { equals: (prev, next) => compareObjects(prev, next) });

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
                <RowLabel class={`border-b col-span-${calculatedAttributes().levels.length - 1}`}>Hälsa för Grad</RowLabel>
            </Row>
            <Row>
                <RowLabel>Ras</RowLabel>
                <Index each={calculatedAttributes().levels}>
                    {value =>
                        <RowCell class='font-bold' >
                            {`Grad ${value()}`}
                        </RowCell>
                    }
                </Index>
            </Row>
            <Index each={Object.keys(calculatedAttributes().health)}>
                {race =>
                    <Row
                        onClick={health()[race() as RaceType] ? () => selectRace(race() as RaceType) : undefined}
                        class='border-t'>
                        <RowLabel class={health()[race() as RaceType] ? '' : 'text-red'}>
                            {RaceNames[race() as RaceType]}
                        </RowLabel>
                        <Index each={calculatedAttributes().levels}>
                            {level =>
                                <RowCell>
                                    <div classList={{
                                        'text-green': calculatedAttributes().highestRace[level()] === race() as RaceType,
                                        'text-red': health()?.[race() as RaceType]?.[level()] ? (health()?.[race() as RaceType]?.[level()] as number) < 1 : true
                                    }}>
                                        {Math.round(health()?.[race() as RaceType]?.[level()] ?? 0)}
                                    </div>
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