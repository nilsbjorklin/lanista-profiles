declare global {
    export type Stat = 'health' | 'strength' | 'endurance' | 'initiative' | 'dodge' | 'axes' | 'swords' | 'maces' | 'staves' | 'shield' | 'spears' | 'chain';
    export type RaceType = 'human' | 'elf' | 'dwarf' | 'orc' | 'troll' | 'goblin' | 'undead' | 'salamanther';
    export type UsedAttribute = Stat | '2h';

    export type Profile = {
        id: string
        name: string
        race: RaceType
        usedAttributes: UsedAttribute[]
        attributes: Attributes
        equipment: Equipment
        target: Target
    }

    type PartialRecord<K extends keyof any, T> = {
        [P in K]?: T;
    };

    export type Attributes = PartialRecord<Stat, number[]>;

    export type Target = Record<string, TargetForLevel>;

    export type TargetForLevel = PartialRecord<Stat, number>;

    export type EquipmentTypeNames = 'weapon' | 'armor' | 'accessories';
    export type WeaponType = 'mainhand' | 'mainhandEnchant' | 'offhand' | 'offhandEnchant' | 'distance' | 'distanceEnchant';
    export type ArmorType = 'head' | 'shoulders' | 'chest' | 'hands' | 'legs' | 'feet';
    export type AccessoryType = 'mantel' | 'necklace' | 'ring' | 'amulet' | 'braclet' | 'ornament';


    export type Equipment = Record<string, EquipmentForLevel>;

    export type EquipmentForLevel = {
        weapon?: Weapons
        armor?: Armor
        accessories?: Accessory
    }
    export interface EquipmentType {
        name: string,
        type: string,
        requirements: Requirements,
        bonus: any
    }
    export type Requirements = {
        minLevel?: number,
        maxLevel?: number,
        attributes?: PartialRecord<Stat, number>
    }

    export type Weapons = PartialRecord<WeaponType, EquipmentType>;
    export type Armor = PartialRecord<ArmorType, EquipmentType>;
    export type Accessory = PartialRecord<AccessoryType, EquipmentType>;

    export type Races = Record<RaceType, {
        name: string;
        stats: {
            [key in Stat]: number
        }
    }>;

    export type Modifier = PartialRecord<Stat, number>;
}

export const RaceNames: Record<RaceType, string> = {
    human: 'Människa',
    elf: 'Alv',
    dwarf: 'Dvärg',
    orc: 'Ork',
    troll: 'Troll',
    goblin: 'Goblin',
    undead: 'Odöd',
    salamanther: 'Salamanther'
}