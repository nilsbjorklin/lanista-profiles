import { createEffect, createMemo, createSignal } from 'solid-js';
import compareObjects from './compareObjects';
import { Profile, Stat, Target } from './data/Types';

export default function TargetValues(getActiveProfile: () => Profile, setProfiles: (value: (prev: any) => any) => void) {
    const [level, setLevel] = createSignal<number>(1);
    const target = createMemo(() => getActiveProfile().target, {}, { equals: (prev, next) => compareTarget(prev, next, level()) });

    function compareTarget(prev: { [key: string]: Target }, next: { [key: string]: Target }, level: number | undefined): boolean {
        if (level) {            
            return compareObjects(prev[level], next[level]);
        }
        return false;
    }

    function setTarget(level: number, stat:Stat, value:number): void {
        setLevel(level);
        setProfiles((prev) => {
            let result = structuredClone(prev);
            result.profiles[result.active].target[level][stat] = value;
            return result;
        })
    }

    createEffect(() => {
        console.log('target()');
        console.log(target());
    })

    return { target, setTarget };
}