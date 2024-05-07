export type Stat = 'health' | 'strength' | 'endurance' | 'initiative' | 'dodge' | 'axes' | 'swords' | 'maces' | 'staves' | 'shield' | 'spears' | 'chain';
export type UsedAttribute = Stat | '2h';
export type RaceType = 'human' | 'elf' | 'dwarf' | 'orc' | 'troll' | 'goblin' | 'undead' | 'salamanther';
export type WeaponType = 'mainhand' | 'mainhandEnchant' | 'offhand' | 'offhandEnchant' | 'distance' | 'distanceEnchant';

export interface Profiles {
    active: string;
    profiles: {
        [key: string]: Profile
    };
}
export interface Profile {
    name: string;
    race: RaceType;
    usedAttributes: UsedAttribute[];
    attributes: Attributes;
    equipment: { [key: string]: Equipment };
    target: { [key: string]: Target };
}
export type Attributes = {
    [key in Stat]?: number[]
}
export interface Equipment {
    weapon?: Weapon;
    armor?: Armor;
    accessories?: Accessories;
}
export type Weapon = {
    [key in WeaponType]?: any
}
export interface Armor {
    head?: any;
    shoulders?: any;
    chest?: any;
    hands?: any;
    legs?: any;
    feet?: any;
}
export interface Accessories {
    mantel?: any;
    necklace?: any;
    ring?: any;
    amulet?: any;
    braclet?: any;
    ornament?: any;
}
export interface Target {
    health?: number;
    strength?: number;
    endurance?: number;
    initiative?: number;
    dodge?: number;
    axes?: number;
    swords?: number;
    maces?: number;
    staves?: number;
    shield?: number;
    spears?: number;
    chain?: number;
}