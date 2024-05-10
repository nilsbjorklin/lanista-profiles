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

export type Attributes = {
    [key in Stat]?: number[]
}

export interface Target {
    [key: string]: TargetForLevel
}

export type TargetForLevel = {
    [key in Stat]?: number
}

export type EquipmentTypeNames = 'weapon' | 'armor' | 'accessories';
export type WeaponType = 'mainhand' | 'mainhandEnchant' | 'offhand' | 'offhandEnchant' | 'distance' | 'distanceEnchant';
export type ArmorType = 'head' | 'shoulders' | 'chest' | 'hands' | 'legs' | 'feet';
export type AccessoryType = 'mantel' | 'necklace' | 'ring' | 'amulet' | 'braclet' | 'ornament';

export type Equipment = {
    [key: string]: EquipmentForLevel;
}

export type EquipmentForLevel = {
    weapon?: Weapons
    armor?: Armor
    accessories?: Accessory
}
export interface EquipmentType {
    name:string,
    type:string,
    requirements: Requirements,
    bonus: any
}
export type Requirements = {
    minLevel?:number,
    maxLevel?:number,
    attributes?: {[key in Stat]?: number}
}

export type Weapons = {
    [key in WeaponType]?: EquipmentType
}

export type Armor = {
    [key in ArmorType]?: EquipmentType
}

export type Accessory = {
    [key in AccessoryType]?: EquipmentType
}

export type Races = {
    [key in RaceType]: {
        name: string;
        stats: {
            [key in Stat]: number
        }
    }
}

export const RaceNames: { [key in RaceType]: string } = {
    human: 'Människa',
    elf: 'Alv',
    dwarf: 'Dvärg',
    orc: 'Ork',
    troll: 'Troll',
    goblin: 'Goblin',
    undead: 'Odöd',
    salamanther: 'Salamanther'
}

export type Modifier = {
    [key in Stat]?: number
}