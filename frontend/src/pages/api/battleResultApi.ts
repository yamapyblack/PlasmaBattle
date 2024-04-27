// import { kv } from "@vercel/kv";
// import { kv } from "../../stores/kv";
import { NextApiRequest, NextApiResponse } from "next";
import { Result } from "../../lib/interfaces/interface";
import { readContract, writeContract } from "@wagmi/core";
import { PlasmaBattleAbi } from "src/constants/plasmaBattleAbi";
import addresses from "src/constants/addresses";
import { createConfig, http } from "wagmi";
import { scrollSepolia } from "wagmi/chains";
import BattleManager from "../../lib/classes/battleManager";
import {
  initMainMembers,
  initEnemyMembers,
  type Unit,
} from "../../lib/contexts/UnitsContext";
import { ethers } from "ethers";

const config = createConfig({
  chains: [scrollSepolia],
  transports: {
    [scrollSepolia.id]: http(scrollSepolia.rpcUrls.default.http[0]),
  },
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  console.log("battleAll start");

  if (request.method === "GET") {
    const battleId = request.query.battleId as string;

    console.log("battleId", battleId);
    const _resData = await readContract(config, {
      address: addresses.PlasmaBattle as `0x${string}`,
      abi: PlasmaBattleAbi,
      functionName: "getBothUnits",
      args: [battleId],
    });
    console.log("_resData", _resData);
    //BitInt to Number
    const playerMembers = _resData![0].map((v) => Number(v));
    const enemyMembers = _resData![1].map((v) => Number(v));

    // return response.status(200).json([playerMembers, enemyMembers]);

    //Response parameter
    let _result = 0;

    //Construct battleClass
    let playerMembersUnits: Unit[] = [];
    playerMembers.forEach((_id) => {
      initMainMembers.forEach((_member) => {
        if (_member.id === _id) {
          playerMembersUnits.push(_member);
        }
      });
    });
    let enemyMembersUnits: Unit[] = [];
    enemyMembers.forEach((_id) => {
      initEnemyMembers.forEach((_unit) => {
        if (_unit.id === _id) {
          enemyMembersUnits.push(_unit);
        }
      });
    });
    console.log("playerMembersUnits", playerMembersUnits);
    console.log("enemyMembersUnits", enemyMembersUnits);

    const battleClass: BattleManager = new BattleManager(
      playerMembersUnits,
      enemyMembersUnits
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

    // Assuming you have the owner's private key

    // Assuming you have the private key and the battleId and result
    const privateKey = process.env.PRIVATE_KEY!;
    const signer = new ethers.Wallet(privateKey);
    console.log("signer", signer);
    console.log("battleId", BigInt(battleId));
    console.log("result", BigInt(_result));
    const messageHash = ethers.solidityPackedKeccak256(
      ["uint", "uint8"],
      [battleId, _result]
    );
    console.log("messageHash", messageHash);
    const signature = await signer.signMessage(ethers.getBytes(messageHash));

    console.log("signature", signature);

    return response
      .status(200)
      .json({ battleId: battleId, result: _result, signature: signature });
  }
}
