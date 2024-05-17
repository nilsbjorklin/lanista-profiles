import { Accessor, For, Match, Show, Switch, createSignal, type Component } from 'solid-js';
import Modal from '../Modal';
import Accessories from '../data/accessories.json';
import Weapons from '../data/weapons.json';
import Row from './Row';
import RowLabel from './RowLabel';

const EquipmentModalHeader: Component<{ equipment: Accessor<EquipmentForLevel | undefined> }> = (props) => {
    return (
        <div class='p-3 flex gap-20'>
            <div class='pb-2'>
                <h2 class='font-bold text-lg'>Vapen</h2>
                <Show when={props.equipment()?.weapon} fallback='Inga vapen valda'>
                    <div>Vapenhand: {props.equipment()?.weapon?.mainhand?.name ?? 'Ej vald'}</div>
                    <div>Sköldhand: {props.equipment()?.weapon?.offhand?.name ?? 'Ej vald'}</div>
                    <div>Distans: {props.equipment()?.weapon?.distanceEnchant?.name ?? (props.equipment()?.weapon?.distance?.name ?? 'Ej vald')}</div>
                </Show>
            </div>
            <div class='pb-2'>
                <h2 class='font-bold text-lg'>Rustning</h2>
                <Show when={props.equipment()?.armor} fallback='Ingen rustning vald'>
                    <div>Huvud: {props.equipment()?.armor?.head?.name ?? 'Ej vald'}</div>
                    <div>Axlar: {props.equipment()?.armor?.shoulders?.name ?? 'Ej vald'}</div>
                    <div>Huvud: {props.equipment()?.armor?.chest?.name ?? 'Ej vald'}</div>
                    <div>Händer: {props.equipment()?.armor?.hands?.name ?? 'Ej vald'}</div>
                    <div>Ben: {props.equipment()?.armor?.legs?.name ?? 'Ej vald'}</div>
                    <div>Fötter: {props.equipment()?.armor?.feet?.name ?? 'Ej vald'}</div>
                </Show>
            </div>
            <div class='pb-2'>
                <h2 class='font-bold text-lg'>Föremål</h2>
                <Show when={props.equipment()?.accessories} fallback='Inga föremål valda'>
                    <div>Mantel: {props.equipment()?.accessories?.mantel?.name ?? 'Ej vald'}</div>
                    <div>Halsband: {props.equipment()?.accessories?.necklace?.name ?? 'Ej vald'}</div>
                    <div>Ring: {props.equipment()?.accessories?.ring?.name ?? 'Ej vald'}</div>
                    <div>Amulett: {props.equipment()?.accessories?.amulet?.name ?? 'Ej vald'}</div>
                    <div>Armband: {props.equipment()?.accessories?.braclet?.name ?? 'Ej vald'}</div>
                    <div>Ornament: {props.equipment()?.accessories?.ornament?.name ?? 'Ej vald'}</div>
                </Show>
            </div>
        </div>
    )
}

const EquipmentChoice: Component<{ level: number, tab: string }> = (props) => {
    let dataStyle = 'p-3 text-center border-l first:border-l-0 ';
    let headerStyle = 'p-3 text-center border-l first:border-l-0 font-bold ';
    return (
        <div class='border'>
            <Switch>
                <Match when={props.tab === 'Vapen'}>
                    <div class='grid auto-cols-fr grid-flow-col'>
                        <div class={headerStyle + 'col-span-2'}>Namn</div>
                        <div class={headerStyle}>Typ</div>
                        <div class={headerStyle}>Skada</div>
                        <div class={headerStyle}>BV</div>
                        <div class={headerStyle}>Styrka</div>
                        <div class={headerStyle}>VF</div>
                    </div>
                    <div class='overflow-y-scroll max-h-96 scrollbar-none'>
                        <For each={Weapons}>
                            {(equipment, index) =>
                                <div class='grid auto-cols-fr grid-flow-col border-t hover'
                                    onClick={() => console.log(equipment)}>
                                    <div class={dataStyle + 'col-span-2'}>{equipment.name}</div>
                                    <div class={dataStyle}>{equipment.type}</div>
                                    <div class={dataStyle}>{`${equipment.minDamage ?? 0} - ${equipment.maxDamage ?? 0}`}</div>
                                    <div class={dataStyle}>{equipment.breakingPoint}</div>
                                    <div class={dataStyle}>{equipment.requirements.strength}</div>
                                    <div class={dataStyle}>{equipment.requirements.skill}</div>
                                </div>
                            }
                        </For>
                    </div>
                </Match>
                <Match when={props.tab === 'Föremål'}>
                    <Row>
                        <RowLabel>Namn</RowLabel>
                        <RowLabel>Typ</RowLabel>
                    </Row>
                    <For each={Accessories}>
                        {(equipment) =>
                            <Row
                                onClick={() => console.log(equipment)}
                                class='border-t'>
                                <div class={dataStyle}>{equipment.name}</div>
                                <div class={dataStyle}>{equipment.type}</div>
                            </Row>
                        }
                    </For>
                </Match>
            </Switch>
        </div>
    )
}

const EquipmentModal: Component<{
    level: number,
    title: string,
    equipment: Accessor<EquipmentForLevel | undefined>,
    display: () => boolean,
    setDisplay: (display: boolean) => void
}> = (props) => {
    const [selectedTab, setSelectedTab] = createSignal('Vapen');
    const tabs = ['Vapen', 'Rustning', 'Föremål']
    return (
        <Modal title={props.title} display={props.display} setDisplay={props.setDisplay}>
            <EquipmentModalHeader equipment={props.equipment} />
            <div class='flex flex-row items-start gap-1'>
                <For each={tabs}>
                    {tab =>
                        <a
                            classList={{
                                'p-3 px-5 select-none rounded-t-md border-none': true,
                                'hover': tab !== selectedTab(),
                                'inverted': tab === selectedTab()
                            }}
                            onClick={() => setSelectedTab(tab)}>
                            {tab}
                        </a>
                    }
                </For>
            </div>
            <EquipmentChoice level={props.level} tab={selectedTab()} />
        </Modal>
    )
}

export default EquipmentModal;