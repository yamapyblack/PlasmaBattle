import { IUnitParam } from "../interfaces/interface";
import LocalStore from "./localStore";
import { initMainMembers, initSubMembers } from "./init";

export const getAllStates = async () => {
  // If stage exists in local storage, return it
  const stage = LocalStore.getInstance().getStage();
  if (stage > 0) {
    //Data exists in local store
    const playerMainMembers = LocalStore.getInstance().getPlayerMembers();
    const playerSubMembers = LocalStore.getInstance().getPlayerSubMembers();
    return { stage, playerMainMembers, playerSubMembers };
  }

  // TODO Get data by Onchain

  //Initial
  return {
    stage: 1,
    playerMainMembers: initMainMembers,
    playerSubMembers: [],
  };
};

export const setAllStates = async (
  stage: number,
  playerMainMembers: IUnitParam[],
  playerSubMembers: IUnitParam[]
) => {
  LocalStore.getInstance().setStage(stage);
  LocalStore.getInstance().setPlayerMembers(playerMainMembers);
  LocalStore.getInstance().setPlayerSubMembers(playerSubMembers);
  //TODO Save data to Onchain
};
