import { IUnitParam } from "../interfaces/interface";

export const initMainMembers: IUnitParam[] = [
  {
    id: 4,
    name: "Ant4",
    image: "1004",
    life: 4,
    attack: 3,
    description: "",
    skillIds: [12],
  },
  {
    id: 1,
    name: "Ant1",
    image: "1001",
    life: 3,
    attack: 2,
    description: "",
    skillIds: [],
  },
];

export const initSubMembers: { [key: number]: IUnitParam[] } = {
  2: [
    {
      id: 2,
      name: "Ant2",
      image: "1002",
      life: 3,
      attack: 3,
      description: "",
      skillIds: [],
    },
  ],
  3: [
    {
      id: 3,
      name: "Ant3",
      image: "1003",
      life: 2,
      attack: 4,
      description: "",
      skillIds: [],
    },
  ],
  4: [
    {
      id: 4,
      name: "Ant4",
      image: "1004",
      life: 4,
      attack: 3,
      description: "",
      skillIds: [12],
    },
  ],
  5: [
    {
      id: 5,
      name: "Ant5",
      image: "1005",
      life: 9,
      attack: 4,
      description: "",
      skillIds: [],
    },
  ],
};

export const enemyMembersByStage: {
  [key: number]: IUnitParam[];
} = {
  1: [
    {
      id: 1001,
      name: "Alice",
      image: "1001",
      life: 2,
      attack: 2,
      description: "Alice's description",
      skillIds: [],
    },
  ],
  2: [
    {
      id: 1001,
      name: "Alice",
      image: "1001",
      life: 2,
      attack: 2,
      description: "Alice's description",
      skillIds: [],
    },
    {
      id: 1003,
      name: "Charlie",
      image: "1003",
      life: 3,
      attack: 2,
      description: "Charlie's description",
      skillIds: [],
    },
  ],
  3: [
    {
      id: 1001,
      name: "Alice",
      image: "1001",
      life: 2,
      attack: 2,
      description: "Alice's description",
      skillIds: [],
    },
    {
      id: 1002,
      name: "Bob",
      image: "1002",
      life: 4,
      attack: 4,
      description: "Bob's description",
      skillIds: [],
    },
    {
      id: 1003,
      name: "Charlie",
      image: "1003",
      life: 2,
      attack: 2,
      description: "Charlie's description",
      skillIds: [],
    },
  ],
  4: [
    {
      id: 1001,
      name: "Alice",
      image: "1001",
      life: 3,
      attack: 3,
      description: "Alice's description",
      skillIds: [],
    },
    {
      id: 1002,
      name: "Bob",
      image: "1002",
      life: 4,
      attack: 4,
      description: "Bob's description",
      skillIds: [],
    },
    {
      id: 1003,
      name: "Charlie",
      image: "1003",
      life: 4,
      attack: 2,
      description: "Charlie's description",
      skillIds: [],
    },
    {
      id: 1003,
      name: "Charlie",
      image: "1003",
      life: 4,
      attack: 2,
      description: "Charlie's description",
      skillIds: [],
    },
  ],
  5: [
    {
      id: 6,
      name: "Wizard1",
      image: "1001",
      life: 4,
      attack: 2,
      description: "",
      skillIds: [7],
    },
    {
      id: 7,
      name: "Wizard2",
      image: "1002",
      life: 4,
      attack: 7,
      description: "",
      skillIds: [7],
    },
    {
      id: 8,
      name: "Boss",
      image: "1003",
      life: 10,
      attack: 10,
      description: "",
      skillIds: [],
    },
  ],
};
