import { createContext, useReducer, Dispatch } from "react";
import { IUnitParam } from "../interfaces/interface";

export type Unit = {
  id: number;
  name: string;
  imagePath: string;
  life: number;
  attack: number;
  description: string;
  skillIds: number[];
};

export const initMainMembers: Unit[] = [
  {
    id: 1,
    name: "Ant1",
    imagePath: "1001",
    life: 3,
    attack: 2,
    description: "",
    skillIds: [],
  },
  {
    id: 2,
    name: "Ant2",
    imagePath: "1002",
    life: 3,
    attack: 3,
    description: "",
    skillIds: [],
  },
  {
    id: 3,
    name: "Ant3",
    imagePath: "1003",
    life: 2,
    attack: 4,
    description: "",
    skillIds: [],
  },
  {
    id: 4,
    name: "Ant4",
    imagePath: "1004",
    life: 4,
    attack: 3,
    description: "",
    skillIds: [],
  },
  {
    id: 5,
    name: "Ant5",
    imagePath: "1005",
    life: 5,
    attack: 4,
    description: "",
    skillIds: [],
  },
];
export const initEnemyMembers: Unit[] = [
  {
    id: 1001,
    name: "Alice",
    imagePath: "1001",
    life: 3,
    attack: 3,
    description: "Alice's description",
    skillIds: [],
  },
  {
    id: 1002,
    name: "Bob",
    imagePath: "1002",
    life: 3,
    attack: 4,
    description: "Bob's description",
    skillIds: [],
  },
  {
    id: 1003,
    name: "Charlie",
    imagePath: "1003",
    life: 4,
    attack: 2,
    description: "Charlie's description",
    skillIds: [],
  },
  {
    id: 1004,
    name: "Charlie",
    imagePath: "1004",
    life: 4,
    attack: 2,
    description: "Charlie's description",
    skillIds: [],
  },
];

export type UnitVariable = {
  life: number;
  attack: number;
  isAnimateChangeLife: boolean;
  isAnimateChangeAttack: boolean;
  isAnimateAttacking: boolean;
};

type UnitsDispatchType = {
  playerDispatch: Dispatch<any>;
  enemyDispatch: Dispatch<any>;
  playerVariableDispatch: Dispatch<any>;
  enemyVariableDispatch: Dispatch<any>;
};

interface IUnitAction {
  type: "added" | "changed" | "deleted";
  unit: Unit;
  index?: number;
}

interface IUnitActionVariable {
  type: "added" | "changed" | "deleted";
  // | "changeAttack"
  // | "changeLife";
  unitVariable: UnitVariable;
  index?: number;
}

// Create contexts
export const PlayerUnitsContext = createContext<Unit[]>([]);
export const EnemyUnitsContext = createContext<Unit[]>([]);
export const PlayerUnitsVariableContext = createContext<UnitVariable[]>([]);
export const EnemyUnitsVariableContext = createContext<UnitVariable[]>([]);
export const UnitsDispatchContext = createContext<UnitsDispatchType>({
  playerDispatch: () => {},
  enemyDispatch: () => {},
  playerVariableDispatch: () => {},
  enemyVariableDispatch: () => {},
});

export function UnitsProvider({ children }) {
  const [playerUnits, playerDispatch] = useReducer(
    unitsReducer,
    initMainMembers
  );
  const [enemyUnits, enemyDispatch] = useReducer(
    unitsReducer,
    initEnemyMembers
  );
  const [playerUnitsVariables, playerVariableDispatch] = useReducer(
    unitsVariableReducer,
    initMainMembers.map((unit) => ({
      life: unit.life,
      attack: unit.attack,
      isAnimateChangeLife: false,
      isAnimateChangeAttack: false,
      isAnimateAttacking: false,
    }))
  );
  const [enemyUnitsVariables, enemyVariableDispatch] = useReducer(
    unitsVariableReducer,
    initEnemyMembers.map((unit) => ({
      life: unit.life,
      attack: unit.attack,
      isAnimateChangeLife: false,
      isAnimateChangeAttack: false,
      isAnimateAttacking: false,
    }))
  );

  if (playerDispatch === null || enemyDispatch === null) return null;
  if (playerVariableDispatch === null || enemyVariableDispatch === null)
    return null;

  return (
    <PlayerUnitsContext.Provider value={playerUnits}>
      <EnemyUnitsContext.Provider value={enemyUnits}>
        <PlayerUnitsVariableContext.Provider value={playerUnitsVariables}>
          <EnemyUnitsVariableContext.Provider value={enemyUnitsVariables}>
            <UnitsDispatchContext.Provider
              value={{
                playerDispatch,
                enemyDispatch,
                playerVariableDispatch,
                enemyVariableDispatch,
              }}
            >
              {children}
            </UnitsDispatchContext.Provider>
          </EnemyUnitsVariableContext.Provider>
        </PlayerUnitsVariableContext.Provider>
      </EnemyUnitsContext.Provider>
    </PlayerUnitsContext.Provider>
  );
}
function unitsReducer(units: Unit[], action: IUnitAction) {
  switch (action.type) {
    case "added": {
      return [...units, action.unit];
    }
    case "changed": {
      return units.map((u, index) => {
        if (index === action.index) {
          return action.unit;
        } else {
          return u;
        }
      });
    }
    case "deleted": {
      return units.filter((_, index) => index !== action.index);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
function unitsVariableReducer(
  unitsVariable: UnitVariable[],
  action: IUnitActionVariable
): UnitVariable[] {
  switch (action.type) {
    case "added": {
      return [...unitsVariable, action.unitVariable];
    }
    case "changed": {
      return unitsVariable.map((u, index) => {
        if (index === action.index) {
          return action.unitVariable;
        } else {
          return u;
        }
      });
    }
    case "deleted": {
      return unitsVariable.filter((_, index) => index !== action.index);
    }
    // case "changeAttack": {
    //   return unitsVariable.map((u, index) => {
    //     if (index === action.index) {
    //       return {
    //         ...u,
    //         attack: action.unitVariable!.attack,
    //         isAnimateChangeAttack: true,
    //       };
    //     } else {
    //       return u;
    //     }
    //   });
    // }
    // case "changeLife": {
    //   return unitsVariable.map((u, index) => {
    //     if (index === action.index) {
    //       return {
    //         ...u,
    //         life: action.unitVariable!.life,
    //         isAnimateChangeLife: true,
    //       };
    //     } else {
    //       return u;
    //     }
    //   });
    // }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
