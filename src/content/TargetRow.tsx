import { Index, Match, Switch, type Component } from 'solid-js';
import { useLayout } from '../LayoutProvider';
import { Stat, Target } from '../data/Types';
import { Row } from './Components';

const TargetRow: Component<{
    usedStats: () => Stat[],
    target: Target | undefined,
    updateTarget: (stat: Stat, value: number) => void,
}> = (props) => {

    return (
        <Switch fallback={<div hidden />}>
            <Match when={props.target}>
                <Switch fallback={<div hidden />}>
                    <Match when={!useLayout()?.desktop()}>
                        <Row>
                            <div class='text-center p-3 border-t font-bold'>Mål för Grad</div>
                        </Row>
                    </Match>
                </Switch>
                <Row>
                    {useLayout()?.desktop() && <div class='p-3 text-center bg-blue text-light font-bold'>Mål</div>}
                    <Index each={props.usedStats()}>
                        {stat =>
                            <input class='input-no-button p-3 text-center bg-blue text-light border-light border-l'
                                type='number'
                                value={((props.target as Target)[stat()] ?? 0).toString()}
                                onInput={e => props.updateTarget(stat(), Number(e.target.value))} />
                        }
                    </Index>
                </Row>
            </Match>
        </Switch>
    )
}

export default TargetRow;