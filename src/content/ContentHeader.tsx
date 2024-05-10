import { Index, type Component } from 'solid-js';
import { useLayout } from '../contexts/LayoutProvider';
import { RaceType, Stat } from '../data/Types';
import StatLabelData from '../data/statLabelData.json';
import Row from './Row';
import { useFields } from '../contexts/FieldsProvider';

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

const ContentHeader: Component<{}> = (props) => {
    const usedStats = useFields()?.usedStats as () => Stat[];
    const modifiers = useFields()?.modifiers as () => { [key in Stat]?: number };
    const race = useFields()?.race as () => RaceType;

    const labelStyle = 'col-span-2 p-3 text-center font-bold';

    type StatLabels = {
        [key in Stat]: {
            sm: string,
            md: string,
            lg: string,
            xl: string
        }
    }

    const ContentHeaderCell: Component<{ value: string }> = (props) => {
        return (
            <div class='p-3 text-center font-bold border-l whitespace-nowrap overflow-hidden'>
                {props.value}
            </div>
        )
    }

    return (
        <div class='flex flex-col w-full rounded-md border mt-1'>
            <Row>
                {useLayout()?.desktop() && <div class={labelStyle}>Egenskaper</div>}
                <Index each={usedStats()}>
                    {stat => <ContentHeaderCell value={(StatLabelData as StatLabels)[stat()][useLayout()?.size() ?? 'sm']} />}
                </Index>
            </Row>
            <Row class='border-t'>
                {useLayout()?.desktop() && <div class={labelStyle}>Bonus för {Races[race()]}</div>}
                <Index each={usedStats()}>
                    {stat => <ContentHeaderCell value={Math.round((modifiers()[stat()] ?? 1) * 100) + '%'} />}
                </Index>
            </Row>
        </div>
    )
}

export default ContentHeader;