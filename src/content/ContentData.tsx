import { Index, type Component } from 'solid-js';
import { Target } from '../data/Types';
import AttributeResultRow from './AttributeResultRow';
import AttributeRow from './AttributeRow';
import Row from './Row';
import TargetRow from './TargetRow';

const ContentData: Component<{
}> = (props) => {

    return (
        <div class='grid grid-flow-row auto-cols-fr overflow-y-scroll scrollbar-none sm:text-sm'>
            <Index each={Array(45)}>
                {(_item, index) => ([
                    <Row class='text-center font-bold pt-4 pb-1'>
                        <div>Grad {index + 1}</div>
                    </Row>,
                    <AttributeRow index={index} />,
                    <AttributeResultRow index={index} />,
                    <TargetRow level={index + 1} />
                ])}
            </Index>
        </div>
    )
}

export default ContentData;