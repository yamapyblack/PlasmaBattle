export enum SKILL_TIMING {
  StartOfBattle,
  BeforeAttack,
  KnockOut,
}
export enum SKILL_EFFECT {
  BuffAttack,
  BuffHealth,
  Damage,
  DebuffAttack,
}
export enum SKILL_TARGET {
  RandomPlayer,
  Random2Players,
  RandomEnemy,
  Random2Enemies,
  InFrontOf,
  Behind,
}

export enum Result {
  NOT_YET,
  WIN,
  LOSE,
  DRAW,
}

export interface IUnitParam {
  id: number;
  name: string;
  image: string;
  life: number;
  attack: number;
  description: string;
  skillIds: number[];
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  timing: SKILL_TIMING;
  effect: SKILL_EFFECT;
  target: SKILL_TARGET;
  value: number;
}
