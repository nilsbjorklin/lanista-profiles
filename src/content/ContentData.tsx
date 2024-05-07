import { Index, type Component } from 'solid-js';
import { Attributes, Stat, Target } from '../data/Types';
import AttributeResultRow from './AttributeResultRow';
import AttributeRow from './AttributeRow';
import TargetRow from './TargetRow';

const ContentData: Component<{
    usedStats: () => Stat[],
    modifiers: () => { [key in Stat]?: number },
    attributes: Attributes,
    setAttribute: (stat: Stat, index: number, value: number) => void,
    attributesTotal: Attributes,
    target: { [key: string]: Target },
    setTarget: (level: number, stat: Stat, value: number) => void,
}> = (props) => {

    return (
        <div class='grid grid-flow-row auto-cols-fr overflow-y-scroll scrollbar-none'>
            <Index each={Array(45)}>
                {(_item, index) => ([
                    <AttributeRow index={index} usedStats={props.usedStats} attributes={props.attributes} setAttribute={props.setAttribute} />,
                    <AttributeResultRow index={index} usedStats={props.usedStats} modifiers={props.modifiers} attributesTotal={props.attributesTotal} />,
                    <TargetRow usedStats={props.usedStats} target={props.target[index + 1]} updateTarget={(stat: Stat, value: number) => props.setTarget(index + 1, stat, value)} />,
                ])}
            </Index>
        </div>
    )
}

export default ContentData;