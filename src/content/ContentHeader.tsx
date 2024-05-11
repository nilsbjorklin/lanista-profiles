import { Index, type Component } from 'solid-js';
import { useLayout } from '../contexts/LayoutProvider';
import { RaceNames } from '../data/Types';
import StatLabelData from '../data/statLabelData.json';
import Row from './Row';
import { useFields } from '../contexts/FieldsProvider';

const ContentHeader: Component<{}> = () => {
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
            <div class='p-3 text-center font-bold border-l first:border-l-0 whitespace-nowrap overflow-hidden'>
                {props.value}
            </div>
        )
    }

    return (
        <div class='flex flex-col w-full rounded-md sm:rounded-none mt-1 border-4 sm:border-x-0'>
            <Row>
                {useLayout()?.desktop() && <div class={labelStyle}>Egenskaper</div>}
                <Index each={usedStats()}>
                    {stat => <ContentHeaderCell value={(StatLabelData as StatLabels)[stat()][useLayout()?.size() ?? 'sm']} />}
                </Index>
            </Row>
            <Row class='border-t'>
                {useLayout()?.desktop() && <div class={labelStyle}>Bonus för {RaceNames[race()]}</div>}
                <Index each={usedStats()}>
                    {stat => <ContentHeaderCell value={Math.round((modifiers()[stat()] ?? 1) * 100) + '%'} />}
                </Index>
            </Row>
        </div>
    )
}

export default ContentHeader;