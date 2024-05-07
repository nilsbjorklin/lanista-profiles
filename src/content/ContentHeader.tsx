import { Index, type Component } from 'solid-js';
import { useLayout } from '../LayoutProvider';
import StatLabelData from '../data/statLabelData.json';
import { Stat } from '../data/Types'
import { Row } from './Components'

const baseStats: Stat[] = ['health', 'strength', 'endurance', 'initiative', 'dodge'];

const ContentHeader: Component<{
    usedStats: () => Stat[],
    modifiers: () => { [key in Stat]?: number }
}> = (props) => {

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
            <div class='p-3 text-center font-bold border-l first:border-dark border-light whitespace-nowrap overflow-hidden'>
                {props.value}
            </div>
        )
    }


    return (
        <div class='flex flex-col w-full rounded-t-md border-2 border-light mt-1'>
            <Row>
                {useLayout()?.desktop() && <ContentHeaderCell value={'Egenskaper'} />}
                <Index each={props.usedStats()}>
                    {stat => <ContentHeaderCell value={(StatLabelData as StatLabels)[stat()][useLayout()?.size() ?? 'sm']} />}
                </Index>
            </Row>
            <Row>
                {useLayout()?.desktop() && <ContentHeaderCell value={'Bonus'} />}
                <Index each={props.usedStats()}>
                    {stat => <ContentHeaderCell value={Math.round((props.modifiers()[stat()] ?? 1) * 100) + '%'} />}
                </Index>
            </Row>
        </div>
    )
}

export default ContentHeader;