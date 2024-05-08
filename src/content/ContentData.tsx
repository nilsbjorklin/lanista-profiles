import { Index, type Component } from 'solid-js';
import { Attributes, Equipment, Stat, Target } from '../data/Types';
import AttributeResultRow from './AttributeResultRow';
import AttributeRow from './AttributeRow';
import TargetRow from './TargetRow';
import Row from './Row';

const ContentData: Component<{
    usedStats: () => Stat[],
    modifiers: () => { [key in Stat]?: number },
    attributes: Attributes,
    setAttribute: (stat: Stat, index: number, value: number) => void,
    attributesTotal: Attributes,
    target: { manual: Target, equipment: Target, total: Target },
    setTarget: (level: number, stat: Stat, value: number) => void,
    equipment: Equipment
}> = (props) => {

    return (
        <div class='grid grid-flow-row auto-cols-fr overflow-y-scroll scrollbar-none text-sm'>
            <Index each={Array(45)}>
                {(_item, index) => ([
                    <Row  class='text-center font-bold pt-4 pb-1'>
                        <div>Grad {index + 1}</div>
                    </Row>,
                    <AttributeRow
                        index={index}
                        usedStats={props.usedStats}
                        attributes={props.attributes}
                        setAttribute={props.setAttribute} />,
                    <AttributeResultRow
                        index={index}
                        usedStats={props.usedStats}
                        modifiers={props.modifiers}
                        attributesTotal={props.attributesTotal} />,
                    <TargetRow
                        level={index + 1}
                        usedStats={props.usedStats}
                        targetManual={props.target.manual[index + 1]}
                        targetEquipment={props.target.manual[index + 1]}
                        targetTotal={props.target.total[index + 1]}
                        setTarget={(stat: Stat, value: number) => props.setTarget(index + 1, stat, value)}
                        equipment={props.equipment[index + 1]} />
                ])}
            </Index>
        </div>
    )
}

export default ContentData;