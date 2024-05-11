import { Index, type Component } from 'solid-js';
import AttributeResultRow from './AttributeResultRow';
import AttributeRow from './AttributeRow';
import Row from './Row';
import TargetRow from './TargetRow';

const ContentData: Component<{}> = () => {

    return (
        <div class='grid grid-flow-row auto-cols-fr overflow-y-scroll scrollbar-none sm:text-sm'>
            <Index each={Array(45)}>
                {(_item, index) => ([
                    <div class='border mt-2 rounded sm:border-x-0'>
                        <Row class='text-center font-bold p-3'>
                            <div>Grad {index + 1}</div>
                        </Row>
                        <AttributeRow index={index} />
                        <AttributeResultRow index={index} />
                        <TargetRow level={index + 1} />
                    </div>
                ])}
            </Index>
        </div>
    )
}

export default ContentData;