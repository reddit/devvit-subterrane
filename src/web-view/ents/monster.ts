import type {Random} from '../../shared/types/random.ts'
import type {Game, InitGame} from '../game.ts'

export type Monster = {
  hp: number
  lvl: number
  dmg: number
  class: MonsterClass
  modifier: MonsterModifier
  species: MonsterSpecies
}

export type MonsterClass = (typeof monsterClass)[number]
export type MonsterSpecies = (typeof monsterSpecies)[number]
export type MonsterModifier = (typeof monsterModifier)[number]

const monsterSpecies = [
  'Arachnid',
  'Beetle',
  'Cyclops',
  'Demon',
  'Fungus',
  'Gargoyle',
  'Ghoul',
  'Ghost',
  'Goblin',
  'Golem',
  'Human',
  'Imp',
  'Lizard',
  'Machine',
  'Ogre',
  'Skeleton',
  'Serpent',
  'Shade',
  'Shapeshifter',
  'Troll',
  'Vampire',
  'Void',
  'Wraith',
  'Wyrm'
] as const

const monsterModifier = [
  'Ageless',
  'Ancient',
  'Artificial',
  'Armored',
  'Barbed',
  'Blue',
  'Cursed',
  'Frozen',
  'Giant',
  'Green',
  'Heavy',
  'Iron',
  'Levitating',
  'Liquid',
  'Prismatic',
  'Red',
  'Swift',
  'Venomous',
  'Volcanic',
  'Warped',
  'Webbed'
] as const

const monsterClass = [
  'Alchemist',
  'Archer',
  'Automaton',
  'Engineer',
  'Gladiator',
  'Hulk',
  'Knight',
  'Mage',
  'Necromancer',
  'Sniper',
  'Soldier',
  'Sorcerer',
  'Witch'
] as const

export function Monster(game: InitGame): Monster {
  const monster = {
    class: monsterClass[Math.trunc(game.rnd.num * monsterClass.length)]!,
    dmg: 0,
    lvl: 1 + Math.ceil(game.p1.lvl + 1 + game.rnd.num * 3),
    modifier:
      monsterModifier[Math.trunc(game.rnd.num * monsterModifier.length)]!,
    species: monsterSpecies[Math.trunc(game.rnd.num * monsterSpecies.length)]!,
    hp: 0
  }
  monster.hp = rollMaxHP(monster, game.rnd)
  return monster
}

function rollMaxHP(monster: Readonly<Monster>, rnd: Random): number {
  let hp = 2 + Math.ceil(rnd.num * 10) + monster.lvl * Math.ceil(10 * rnd.num)
  switch (monster.class) {
    case 'Alchemist':
      hp += 1
      break
    case 'Archer':
      hp += 2
      break
    case 'Automaton':
      hp += 5
      break
    case 'Engineer':
      hp -= 1
      break
    case 'Gladiator':
      hp += monster.lvl
      break
    case 'Hulk':
      hp += 5 + Math.trunc(rnd.num * monster.lvl)
      break
    case 'Knight':
      hp += Math.ceil(monster.lvl / 2)
      break
    case 'Mage':
      hp += 0
      break
    case 'Necromancer':
      hp += 8 + Math.trunc(rnd.num * monster.lvl)
      break
    case 'Sniper':
      hp += 7
      break
    case 'Soldier':
      hp += 10
      break
    case 'Sorcerer':
      hp += 3
      break
    case 'Witch':
      hp += 4
      break
    default:
      monster.class satisfies never
  }
  switch (monster.modifier) {
    case 'Blue':
    case 'Green':
    case 'Prismatic':
    case 'Red':
      hp += 0
      break
    case 'Ageless':
      hp += monster.lvl
      break
    case 'Ancient':
      hp += 0
      break
    case 'Armored':
      hp += 8 + Math.trunc(rnd.num * monster.lvl)
      break
    case 'Artificial':
      hp += 13
      break
    case 'Barbed':
      hp += 1
      break
    case 'Cursed':
      hp += 2
      break
    case 'Frozen':
      hp += 3
      break
    case 'Giant':
      hp += Math.ceil(monster.lvl / 4)
      break
    case 'Heavy':
      hp += 4
      break
    case 'Iron':
      hp += Math.ceil(monster.lvl / 2)
      break
    case 'Levitating':
      hp += 5
      break
    case 'Liquid':
      hp += 6
      break
    case 'Swift':
      hp += 7
      break
    case 'Venomous':
      hp += 8
      break
    case 'Volcanic':
      hp += 9
      break
    case 'Warped':
      hp += 10
      break
    case 'Webbed':
      hp += 11
      break
    default:
      monster.modifier satisfies never
  }
  switch (monster.species) {
    case 'Arachnid':
      hp += 1
      break
    case 'Beetle':
      hp += 2
      break
    case 'Cyclops':
      hp += 3
      break
    case 'Demon':
      hp += 3
      break
    case 'Fungus':
      hp += 4
      break
    case 'Gargoyle':
      hp += 5
      break
    case 'Ghost':
      hp += 6
      break
    case 'Ghoul':
      hp += 7
      break
    case 'Goblin':
      hp += 8
      break
    case 'Golem':
      hp += 9
      break
    case 'Human':
      hp += 0
      break
    case 'Imp':
      hp += 10
      break
    case 'Lizard':
      hp += 11
      break
    case 'Machine':
      hp += Math.ceil(monster.lvl / 2)
      break
    case 'Ogre':
      hp += 12
      break
    case 'Serpent':
      hp += 13
      break
    case 'Shade':
      hp += 14
      break
    case 'Shapeshifter':
      hp += 15
      break
    case 'Skeleton':
      hp += 16
      break
    case 'Troll':
      hp += 17
      break
    case 'Vampire':
      hp += 30 + Math.trunc(rnd.num * monster.lvl)
      break
    case 'Void':
      hp += monster.lvl
      break
    case 'Wraith':
      hp += 18
      break
    case 'Wyrm':
      hp += 19
      break
    default:
      monster.species satisfies never
  }
  return hp
}

// to-do: make this different than hp.
export function rollDmg(monster: Readonly<Monster>, rnd: Random): number {
  let dmg = 2 + Math.ceil(rnd.num * 10) + monster.lvl * Math.ceil(10 * rnd.num)
  switch (monster.class) {
    case 'Alchemist':
      dmg += 1
      break
    case 'Archer':
      dmg += 2
      break
    case 'Automaton':
      dmg += 5
      break
    case 'Engineer':
      dmg -= 1
      break
    case 'Gladiator':
      dmg += monster.lvl
      break
    case 'Hulk':
      dmg += 20
      break
    case 'Knight':
      dmg += Math.ceil(monster.lvl / 2)
      break
    case 'Mage':
      dmg += 0
      break
    case 'Necromancer':
      dmg += 30
      break
    case 'Sniper':
      dmg += 7
      break
    case 'Soldier':
      dmg += 10
      break
    case 'Sorcerer':
      dmg += 3
      break
    case 'Witch':
      dmg += 4
      break
    default:
      monster.class satisfies never
  }
  switch (monster.modifier) {
    case 'Blue':
    case 'Green':
    case 'Prismatic':
    case 'Red':
      dmg += 0
      break
    case 'Ageless':
      dmg += monster.lvl
      break
    case 'Ancient':
      dmg += 0
      break
    case 'Armored':
      dmg += 0
      break
    case 'Artificial':
      dmg += 13
      break
    case 'Barbed':
      dmg += 1
      break
    case 'Cursed':
      dmg += 2
      break
    case 'Frozen':
      dmg += 3
      break
    case 'Giant':
      dmg += Math.ceil(monster.lvl / 4)
      break
    case 'Heavy':
      dmg += 4
      break
    case 'Iron':
      dmg += Math.ceil(monster.lvl / 2)
      break
    case 'Levitating':
      dmg += 5
      break
    case 'Liquid':
      dmg += 6
      break
    case 'Swift':
      dmg += 7
      break
    case 'Venomous':
      dmg += 8
      break
    case 'Volcanic':
      dmg += 9
      break
    case 'Warped':
      dmg += 10
      break
    case 'Webbed':
      dmg += 11
      break
    default:
      monster.modifier satisfies never
  }
  switch (monster.species) {
    case 'Arachnid':
      dmg += 1
      break
    case 'Beetle':
      dmg += 2
      break
    case 'Cyclops':
      dmg += 3
      break
    case 'Demon':
      dmg += 3
      break
    case 'Fungus':
      dmg += 4
      break
    case 'Gargoyle':
      dmg += 5
      break
    case 'Ghost':
      dmg += 6
      break
    case 'Ghoul':
      dmg += 7
      break
    case 'Goblin':
      dmg += 8
      break
    case 'Golem':
      dmg += 9
      break
    case 'Human':
      dmg += 0
      break
    case 'Imp':
      dmg += 10
      break
    case 'Lizard':
      dmg += 11
      break
    case 'Machine':
      dmg += Math.ceil(monster.lvl / 2)
      break
    case 'Ogre':
      dmg += 12
      break
    case 'Serpent':
      dmg += 13
      break
    case 'Shade':
      dmg += 14
      break
    case 'Shapeshifter':
      dmg += 15
      break
    case 'Skeleton':
      dmg += 16
      break
    case 'Troll':
      dmg += 17
      break
    case 'Vampire':
      dmg += 20
      break
    case 'Void':
      dmg += monster.lvl
      break
    case 'Wraith':
      dmg += 18
      break
    case 'Wyrm':
      dmg += 19
      break
    default:
      monster.species satisfies never
  }
  return Math.floor(((dmg * monster.lvl) / 10) * rnd.num)
}
