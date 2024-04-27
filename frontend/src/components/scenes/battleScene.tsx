import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { Scene } from "../../pages/index";
import { enemyMembersByStage } from "../../lib/data/init";
import UnitsComponent from "../../components/ingame/UnitsComponent";
import {
  Result,
  SKILL_TIMING,
  SKILL_EFFECT,
  SKILL_TARGET,
  Skill,
} from "../../lib/interfaces/interface";
import { SKILLS } from "../../constants/skills";
import {
  UnitsDispatchContext,
  PlayerUnitsContext,
  PlayerUnitsVariableContext,
  EnemyUnitsContext,
  EnemyUnitsVariableContext,
  type Unit,
  type UnitVariable,
} from "../../lib/contexts/UnitsContext";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PlasmaBattleAbi } from "src/constants/plasmaBattleAbi";
import addresses from "src/constants/addresses";

enum PHASE {
  BEFORE_BATTLE,
  BEFORE_ATTACK,
  ATTACKING,
}

const BattleScene = ({ setScene, setResult }) => {
  /**============================
 * useState, useContext
 ============================*/
  const [stage, setStage] = useState(4);
  const [phase, setPhase] = useState(PHASE.BEFORE_BATTLE);
  const [isPlayerDead, setIsPlayerDead] = useState(false);
  const [isEnemyDead, setIsEnemyDead] = useState(false);
  const playerUnits = useContext(PlayerUnitsContext);
  const enemyUnits = useContext(EnemyUnitsContext);
  const playerUnitsVariable = useContext(PlayerUnitsVariableContext);
  const enemyUnitsVariable = useContext(EnemyUnitsVariableContext);
  const {
    playerDispatch,
    enemyDispatch,
    playerVariableDispatch,
    enemyVariableDispatch,
  } = useContext(UnitsDispatchContext);

  const [isCoverVisible, setCoverVisible] = useState(true); // New state variable
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash: hash });

  /**============================
 * useEffect
 ============================*/
  useEffect(() => {
    const judge = async (): Promise<number> => {
      console.log("judge");
      console.log("isPlayerDead", isPlayerDead);
      //If no member, game over
      if (isPlayerDead || isEnemyDead) {
        if (isPlayerDead && isEnemyDead) {
          setResult(Result.DRAW);
        } else if (isPlayerDead) {
          setResult(Result.LOSE);
        } else if (isEnemyDead) {
          setResult(Result.WIN);
        }
        return setScene(Scene.Over);
      } else {
        return Result.NOT_YET;
      }
    };
    judge();
  }, [isPlayerDead, isEnemyDead, setResult, setScene]);

  /**============================
 * Logic
 ============================*/
  const buffAttack = async (
    isToPlayer: boolean,
    index: number,
    value: number
  ): Promise<void> => {
    if (isToPlayer) {
      const _unitVariable = playerUnitsVariable[index];
      _unitVariable.attack += value;
      _unitVariable.isAnimateChangeAttack = true;
      playerVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: _unitVariable,
      });
    } else {
      const _unitVariable = enemyUnitsVariable[index];
      _unitVariable.attack += value;
      _unitVariable.isAnimateChangeAttack = true;
      enemyVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: _unitVariable,
      });
    }
  };

  const buffLife = async (
    isToPlayer: boolean,
    index: number,
    value: number
  ) => {
    if (isToPlayer) {
      const _unitVariable = playerUnitsVariable[index];
      _unitVariable.life += value;
      _unitVariable.isAnimateChangeLife = true;
      playerVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: _unitVariable,
      });
    } else {
      const _unitVariable = enemyUnitsVariable[index];
      _unitVariable.life += value;
      _unitVariable.isAnimateChangeLife = true;
      enemyVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: _unitVariable,
      });
    }
  };

  const debuffAttack = async (
    isToPlayer: boolean,
    index: number,
    value: number
  ) => {
    if (isToPlayer) {
      const _unitVariable = playerUnitsVariable[index];
      //attack cannot be negative
      _unitVariable.attack -= value;
      if (_unitVariable.attack < 0) _unitVariable.attack = 0;
      _unitVariable.isAnimateChangeAttack = true;
      playerVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: _unitVariable,
      });
    } else {
      const _unitVariable = enemyUnitsVariable[index];
      //attack cannot be negative
      _unitVariable.attack -= value;
      if (_unitVariable.attack < 0) _unitVariable.attack = 0;
      _unitVariable.isAnimateChangeAttack = true;
      enemyVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: _unitVariable,
      });
    }
  };

  const damageLife = async (
    isToPlayer: boolean,
    index: number,
    value: number
  ) => {
    if (isToPlayer) {
      const _unitVariable = playerUnitsVariable[index];
      _unitVariable.life -= value;
      if (_unitVariable.life < 0) _unitVariable.life = 0;
      _unitVariable.isAnimateChangeLife = true;
      playerVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: _unitVariable,
      });
    } else {
      const _unitVariable = enemyUnitsVariable[index];
      _unitVariable.life -= value;
      if (_unitVariable.life < 0) _unitVariable.life = 0;
      _unitVariable.isAnimateChangeLife = true;
      enemyVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: _unitVariable,
      });
    }
  };

  const judgeUnitKilled = async (isPlayer: boolean, index: number) => {
    const unitsVariable = isPlayer ? playerUnitsVariable : enemyUnitsVariable;
    const setDead = isPlayer ? setIsPlayerDead : setIsEnemyDead;
    const dispatch = isPlayer ? playerDispatch : enemyDispatch;
    const variableDispatch = isPlayer
      ? playerVariableDispatch
      : enemyVariableDispatch;

    //Judge if life is 0
    if (unitsVariable[index].life === 0) {
      if (unitsVariable.length === 1) {
        console.log(isPlayer ? "setIsPlayerDead" : "setIsEnemyDead");
        setDead(true);
      }
      dispatch({
        type: "deleted",
        index: index,
      });
      variableDispatch({
        type: "deleted",
        index: index,
      });
    }
  };
  /**============================
 * Skills
 ============================*/
  const _emitSkillEffect = async (
    skillEffect: SKILL_EFFECT,
    isToPlayer: boolean,
    toIndexes: number[],
    values: number[]
  ): Promise<void> => {
    console.log("emitSkillEffect", toIndexes);
    if (toIndexes.length !== values.length) {
      console.error("emitSkillEffect: Index and value length are not same");
      return;
    }

    for (let i = 0; i < toIndexes.length; i++) {
      switch (skillEffect) {
        case SKILL_EFFECT.BuffAttack:
          await buffAttack(isToPlayer, toIndexes[i], values[i]);
          break;
        case SKILL_EFFECT.BuffHealth:
          // buffHealth(isToPlayer, i, values[i]);
          break;
        case SKILL_EFFECT.Damage:
          // await _unit.damageLife(values[i]);
          if (isToPlayer) {
            //TODO
            // await _judgePlayerKilled(unitIndexes[i]);
          } else {
            // await _judgeEnemyKilled(unitIndexes[i]);
          }
          break;
        case SKILL_EFFECT.DebuffAttack:
          // await _unit.debuffAttack(values[i]);
          break;
        default:
          console.error("Invalid skill effect");
      }
    }

    // Wait for 2 second to complete animation
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const _getRandomTargets = (num: number, isPlayer: boolean): number[] => {
    console.log("getRandomTargets");

    let _randomIndexes: number[] = [];
    while (_randomIndexes.length < num) {
      const _randomIndex = Math.floor(
        Math.random() *
          //TODO Get members by functions
          (isPlayer ? playerUnits.length : enemyUnits.length)
      );
      if (!_randomIndexes.includes(_randomIndex)) {
        _randomIndexes.push(_randomIndex);
      }
    }
    return _randomIndexes;
  };

  const _getSkillTarget = (
    _skillTarget: SKILL_TARGET,
    _skillValue: number,
    _isFromPlayer: boolean,
    _fromMemberIdx: number
  ): [boolean, number[], number[]] => {
    console.log("getSkillTarget", _fromMemberIdx);
    let _isToPlayer: boolean;
    let _unitIndexes: number[] = [];
    let _values: number[] = [];

    switch (_skillTarget) {
      case SKILL_TARGET.RandomPlayer:
        console.log("RandomPlayer");
        if (_isFromPlayer) {
          _isToPlayer = true;
          _unitIndexes = _getRandomTargets(1, _isToPlayer);
        } else {
          _isToPlayer = false;
          _unitIndexes = _getRandomTargets(1, _isToPlayer);
        }
        _values = [_skillValue];
        break;

      case SKILL_TARGET.Random2Players:
        console.log("Random2Players");
        if (_isFromPlayer) {
          _isToPlayer = true;
          _unitIndexes = _getRandomTargets(2, _isToPlayer);
        } else {
          _isToPlayer = false;
          _unitIndexes = _getRandomTargets(2, _isToPlayer);
        }
        _values = [_skillValue, _skillValue];
        break;

      case SKILL_TARGET.RandomEnemy:
        console.log("RandomEnemy");
        if (_isFromPlayer) {
          _isToPlayer = false;
          _unitIndexes = _getRandomTargets(1, _isToPlayer);
        } else {
          _isToPlayer = true;
          _unitIndexes = _getRandomTargets(1, _isToPlayer);
        }
        _values = [_skillValue];
        break;

      case SKILL_TARGET.Random2Enemies:
        console.log("Random2Enemies");
        if (_isFromPlayer) {
          _isToPlayer = false;
          _unitIndexes = _getRandomTargets(2, _isToPlayer);
        } else {
          _isToPlayer = true;
          _unitIndexes = _getRandomTargets(2, _isToPlayer);
        }
        _values = [_skillValue, _skillValue];
        break;

      case SKILL_TARGET.InFrontOf:
        console.log("InFrontOf");
        if (_isFromPlayer) {
          _isToPlayer = true;
          _unitIndexes = _fromMemberIdx > 0 ? [_fromMemberIdx - 1] : [];
        } else {
          _isToPlayer = false;
          _unitIndexes = _fromMemberIdx > 0 ? [_fromMemberIdx - 1] : [];
        }
        _values = [_skillValue];
        break;

      case SKILL_TARGET.Behind:
        console.log("Behind");
        if (_isFromPlayer) {
          _isToPlayer = true;
          _unitIndexes =
            _fromMemberIdx < playerUnits.length - 1 ? [_fromMemberIdx + 1] : [];
        } else {
          _isToPlayer = false;
          _unitIndexes =
            _fromMemberIdx < enemyUnits.length - 1 ? [_fromMemberIdx + 1] : [];
        }
        _values = [_skillValue];
        break;

      default:
        _isToPlayer = false; //TODO error handling
        console.error("Invalid skill target");
    }
    return [_isToPlayer, _unitIndexes, _values];
  };

  //unused
  const _useSkill = async (
    _isFromPlayer: boolean,
    _fromMemberIdx: number
  ): Promise<void> => {
    console.log("useSkill");
  };

  const _executeSkill = async (
    _timing: SKILL_TIMING,
    _isFromPlayer: boolean,
    _fromMemberIdx: number
  ): Promise<void> => {
    // console.log("executeSkill", _timing, _isFromPlayer, _fromMemberIdx);

    const _unit: Unit = _isFromPlayer
      ? playerUnits[_fromMemberIdx]
      : enemyUnits[_fromMemberIdx];

    for (let i = 0; i < _unit.skillIds.length; i++) {
      const _skill = SKILLS[_unit.skillIds[i]];
      if (_skill.timing !== _timing) continue;

      //TODO If possible, remove this function
      //TODO animate skill executor
      // await _useSkill(_isFromPlayer, _fromMemberIdx);

      const [_isToPlayer, _unitIndexes, _values] = _getSkillTarget(
        _skill.target,
        _skill.value,
        _isFromPlayer,
        _fromMemberIdx
      );
      if (_unitIndexes.length === 0) continue;

      await _emitSkillEffect(_skill.effect, _isToPlayer, _unitIndexes, _values);
    }
  };

  /**============================
 * Functions(Flow)
 ============================*/

  const startOfBattle = async () => {
    console.log("startOfBattle");

    writeContract(
      {
        address: addresses.PlasmaBattle as `0x${string}`,
        abi: PlasmaBattleAbi,
        functionName: "startBattle",
        args: [
          [0, 1, 2, 3, 4].map((i) => {
            if (playerUnits[i] === undefined) return 0;
            return playerUnits[i].id;
          }),
          [0, 1, 2, 3, 4].map((i) => {
            if (enemyUnits[i] === undefined) return 0;
            return enemyUnits[i].id;
          }),
        ],
      },
      {
        onSuccess: () => {
          console.log("onSuccess");
          setCoverVisible(false);
          setPhase(PHASE.BEFORE_ATTACK);
        },
        onError: (e) => {
          console.error(e);
        },
      }
    );

    //TODO revive
    // //Execute skill from behind member
    // for (let i = playerUnits.length - 1; i >= 0; i--) {
    //   await _executeSkill(SKILL_TIMING.StartOfBattle, true, i);
    // }

    // for (let i = enemyUnits.length - 1; i >= 0; i--) {
    //   await _executeSkill(SKILL_TIMING.StartOfBattle, false, i);
    // }
  };

  const goNextAction = async () => {
    if (phase === PHASE.BEFORE_ATTACK) {
      //beforeAttack
      setPhase(PHASE.ATTACKING);
      await _executeSkill(SKILL_TIMING.BeforeAttack, true, 0);
      await _executeSkill(SKILL_TIMING.BeforeAttack, false, 0);

      //attacking
      const _player = playerUnits[0];
      const _enemy = enemyUnits[0];
      await damageLife(true, 0, _enemy.attack);
      await damageLife(false, 0, _player.attack);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //Judge if life is 0
      //Because of animation simultaneously, use Promise.all
      await Promise.all([judgeUnitKilled(true, 0), judgeUnitKilled(false, 0)]);

      //Back to beforeAttack
      setPhase(PHASE.BEFORE_ATTACK);
    }
  };

  /**============================
 * Rendering
 ============================*/
  return (
    <>
      <div className="flex flex-col items-center m-auto">
        {(isCoverVisible || isLoading) && (
          <>
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
              style={{ zIndex: 999 }}
            >
              <div className="text-center">
                <button
                  className="bg-sub font-bold px-16 py-3 rounded-md text-decoration-none"
                  onClick={() => {
                    if (isLoading) return;
                    startOfBattle();
                  }}
                >
                  {isLoading ? "Loading..." : "Start"}
                </button>
              </div>
            </div>
          </>
        )}
        <header className="p-2 w-3/4">
          <div className="flex justify-between items-center w-20 rounded-md bg-darkgray mt-4 pl-2 pr-2">
            <Image src="/images/edit/stage.png" alt="" width={16} height={16} />
            <div className="text-lg font-bold">{stage}</div>
          </div>
        </header>
        <main style={{ width: "800px", margin: "auto" }}>
          <div className="flex flex-col">
            <UnitsComponent />
            <section className="mt-8 mb-8">
              <div className="text-center">
                <button
                  className="bg-sub font-bold pl-14 pr-12 py-1 rounded-md text-decoration-none"
                  onClick={() => {
                    goNextAction();
                  }}
                >
                  <Image
                    src="/images/common/resume.png"
                    alt=""
                    width={24}
                    height={16}
                  />
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default BattleScene;
