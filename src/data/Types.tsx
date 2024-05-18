declare global {
    export type WeaponType = 'axes' | 'swords' | 'maces' | 'staves' | 'shield' | 'spears' | 'chain';
    export type Stat = 'health' | 'strength' | 'endurance' | 'initiative' | 'dodge' | WeaponType;
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

    export type EquipmentCategory = 'weapon' | 'armor' | 'accessories';
    export type WeaponWieldType = 'mainhand' | 'mainhandEnchant' | 'offhand' | 'offhandEnchant' | 'distance' | 'distanceEnchant';
    export type ArmorType = 'head' | 'shoulders' | 'chest' | 'hands' | 'legs' | 'feet';
    export type AccessoryType = 'mantel' | 'necklace' | 'ring' | 'amulet' | 'braclet' | 'ornament';


    export type EquipmentList = Record<string, EquipmentForLevel>;

    export type EquipmentForLevel = {
        weapon?: Weapons
        armor?: Armor
        accessories?: Accessory
    }
    export interface Equipment {
        name: string,
        requirements: Requirements,
        bonus: any
    }

    export interface Weapon extends Equipment {
        wield: '2h' | '1h' | 'distance',
        type: WeaponType | 'distance',
        minDamage: number,
        maxDamage: number,
        breakingPoint: number
    }

    export type Requirements = {
        minLevel?: number,
        maxLevel?: number,
        strength?: number,
        skill?: number,
        attributes?: PartialRecord<Stat, number>
    }

    export type Weapons = PartialRecord<WeaponWieldType, Weapon>;
    export type Armor = PartialRecord<ArmorType, Equipment>;
    export type Accessory = PartialRecord<AccessoryType, Equipment>;

    export type Races = Record<RaceType, {
        name: string;
        stats: {
            [key in Stat]: number
        }
    }>;

    export type Modifier = PartialRecord<Stat, number>;
}

export const WeaponTypes: WeaponType[] = ['axes', 'swords', 'maces', 'staves', 'shield', 'spears', 'chain'];

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

export const WeaponNames: { [key in WeaponType | '1h' | '2h' | 'distance']: string } = {
    'axes': 'Yxor',
    'swords': 'Svärd',
    'maces': 'Hammare',
    'staves': 'Stavar',
    'shield': 'Sköldar',
    'spears': 'Stick',
    'chain': 'Kätting',
    '2h': 'Tvåhand',
    '1h': 'Enhand',
    'distance': 'Distans'
}
