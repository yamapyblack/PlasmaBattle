import { useContext } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  UnitsDispatchContext,
  PlayerUnitsContext,
  PlayerUnitsVariableContext,
  EnemyUnitsContext,
  EnemyUnitsVariableContext,
  type Unit,
  type UnitVariable,
} from "../../lib/contexts/UnitsContext";

interface UnitComponentProps {
  isPlayer: boolean;
  index: number;
  unit?: Unit;
  unitVariable?: UnitVariable;
}

const UnitsComponent = () => {
  const playerUnits = useContext(PlayerUnitsContext);
  const enemyUnits = useContext(EnemyUnitsContext);
  const playerUnitsVariable = useContext(PlayerUnitsVariableContext);
  const enemyUnitsVariable = useContext(EnemyUnitsVariableContext);

  return (
    <>
      <section className="mt-2">
        <div className="m-auto" style={{ width: "400px" }}>
          <div
            className="flex justify-start p-2 w-full"
            style={{ height: 132 }}
          >
            {enemyUnits.map(
              (_enemyUnit, index) =>
                index !== 0 && (
                  <div className="mx-2" key={index}>
                    <UnitComponent
                      isPlayer={false}
                      index={index}
                      unit={_enemyUnit}
                      unitVariable={enemyUnitsVariable[index]}
                    />
                  </div>
                )
            )}
          </div>
        </div>
      </section>
      <section className="mt-4">
        <div className="flex justify-center p-4">
          <div className="my-2 mx-6">
            <UnitComponent
              isPlayer={true}
              index={0}
              unit={playerUnits[0]}
              unitVariable={playerUnitsVariable[0]}
            />
          </div>
          <div className="my-2 mx-6">
            <UnitComponent
              isPlayer={false}
              index={0}
              unit={enemyUnits[0]}
              unitVariable={enemyUnitsVariable[0]}
            />
          </div>
        </div>
      </section>
      <section className="mt-4">
        <div className=" m-auto" style={{ width: "400px" }}>
          <div className="flex justify-end p-2 w-full" style={{ height: 132 }}>
            {playerUnits.map(
              (_playerUnit, index) =>
                index !== 0 && (
                  <div className="mx-2" key={index}>
                    <UnitComponent
                      isPlayer={true}
                      index={index}
                      unit={_playerUnit}
                      unitVariable={playerUnitsVariable[index]}
                    />
                  </div>
                )
            )}
          </div>
        </div>
      </section>
    </>
  );
};

const UnitComponent = ({
  isPlayer,
  index,
  unit,
  unitVariable,
}: UnitComponentProps) => {
  const { playerVariableDispatch, enemyVariableDispatch } =
    useContext(UnitsDispatchContext);
  if (!unit || !unitVariable) return;

  const unitImageSize = index === 0 ? 144 : 80;
  const attackImageSize = index === 0 ? 40 : 28;
  const lifeImageSize = index === 0 ? 40 : 28;
  const marginTop = index === 0 ? "-mt-10" : "-mt-8";
  const width = index === 0 ? "w-12" : "w-8";

  const resetIsAnimation = () => {
    unitVariable.isAnimateChangeLife = false;
    unitVariable.isAnimateChangeAttack = false;
    unitVariable.isAnimateAttacking = false;

    if (isPlayer) {
      playerVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: unitVariable,
      });
    } else {
      enemyVariableDispatch({
        type: "changed",
        index: index,
        unitVariable: unitVariable,
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={unitVariable.isAnimateAttacking ? { y: -20 } : {}}
        transition={{
          repeatType: "mirror",
          repeat: 3,
          duration: 0.16,
          type: "spring",
        }}
        onAnimationComplete={() => {
          // console.log("Animation completed");
          //TODO attack animation
          // setIsAnimateAttacking(true, index, false);
        }}
      >
        <Image
          src={`/images/cards/${unit.imagePath}.png`}
          alt=""
          width={unitImageSize}
          height={16}
        />
      </motion.div>
      <div className={`flex justify-between ${marginTop}`}>
        <div className={`${width} relative`}>
          <Image
            src="/images/common/attack.png"
            alt=""
            width={attackImageSize}
            height={attackImageSize}
          />
          <NumberComponent
            index={index}
            value={unitVariable.attack}
            isAnimate={unitVariable.isAnimateChangeAttack}
            resetIsAnimation={resetIsAnimation}
          />
        </div>
        <div className={`${width} relative`}>
          <Image
            src="/images/common/life.png"
            alt=""
            width={lifeImageSize}
            height={lifeImageSize}
          />
          <NumberComponent
            index={index}
            value={unitVariable.life}
            isAnimate={unitVariable.isAnimateChangeLife}
            resetIsAnimation={resetIsAnimation}
          />
        </div>
      </div>
    </>
  );
};

const NumberComponent = ({ index, value, isAnimate, resetIsAnimation }) => {
  const cellWidth = index === 0 ? 36 : 24;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 2,
        top: 3,
      }}
      initial={{ width: cellWidth, x: 0, y: 0 }}
      animate={
        isAnimate
          ? {
              width: cellWidth * 2,
              x: -cellWidth / 2,
              y: -cellWidth / 2,
            }
          : {}
      }
      transition={{
        repeatType: "mirror",
        repeat: 1,
        duration: 0.2,
        type: "spring",
      }}
      onAnimationComplete={() => {
        // console.log("Animation completed");
        resetIsAnimation();
      }}
    >
      <Image
        src={`/images/common/numbers/${value}.png`}
        alt=""
        width={100}
        height={100}
      />
    </motion.div>
  );
};

export default UnitsComponent;
