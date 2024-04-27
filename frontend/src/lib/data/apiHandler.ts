import { IUnitParam } from "../interfaces/interface";

export const postBattleAllApi = async (
  playerMembers: IUnitParam[],
  enemyMembers: IUnitParam[]
) => {
  console.log("postBattleAllApi");
  //url parameter craft_id
  const url = `/api/battleAll`;
  const params = { playerMembers: playerMembers, enemyMembers: enemyMembers };
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(params),
    });
    const resJson = await response.json();
    console.log("res:", resJson);
    return resJson;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getBattleResult = async (txHash: string) => {
  console.log("getBattleResult");
  //url parameter craft_id
  const url = `/api/battleResult/${txHash}`;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });
    const resJson = await response.json();
    console.log("res:", resJson);
    return resJson;
  } catch (error) {
    console.error("Error:", error);
  }
};
