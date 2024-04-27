// import { kv } from "@vercel/kv";
// import { kv } from "../../stores/kv";
import { NextApiRequest, NextApiResponse } from "next";
import BattleManager from "../../lib/classes/battleManager";
import { Result } from "../../lib/interfaces/interface";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  console.log("battleAll start");

  if (request.method === "POST") {
    const body = request.body;
    console.log("request.body", body);
    //Validate request body
    if (body.playerMembers === undefined || body.enemyMembers === undefined) {
      return response
        .status(400)
        .json({ error: "playerMembers or enemyMembers is undefined" });
    }

    //Response parameter
    let _result: Result = Result.NOT_YET;

    //Construct battleClass
    const battleClass: BattleManager = new BattleManager(
      body.playerMembers,
      body.enemyMembers
    );

    //Start of battle
    await battleClass.startOfBattle();
    _result = await battleClass.judge();
    if (_result !== Result.NOT_YET) {
      return response.status(200).json({ result: _result });
    }

    let loopCount = 0;
    while (true) {
      console.log("Start beforeAttack: ", loopCount);
      await battleClass.beforeAttack();
      _result = await battleClass.judge();
      if (_result !== Result.NOT_YET) break;

      console.log("Start attacking: ", loopCount);
      await battleClass.attacking();
      _result = await battleClass.judge();
      if (_result !== Result.NOT_YET) break;

      loopCount++;
    }

    return response.status(200).json({ result: _result });
  }
}
