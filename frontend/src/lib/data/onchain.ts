import { sendTransaction, Config } from "@wagmi/core";
import { parseEther } from "viem";
import { PlasmaBattleAbi } from "src/constants/plasmaBattleAbi";

export const sendEth = async (config: Config): Promise<void> => {
  console.log("sendEth");
  const result = await sendTransaction(config, {
    to: "0x",
    value: parseEther("0.01"),
  }).catch((e) => {
    console.error(e);
  });
};

export const startBattle = async (config: Config): Promise<void> => {
  console.log("sendEth");
  const result = await sendTransaction(config, {
    to: "0x",
    value: parseEther("0.01"),
  }).catch((e) => {
    console.error(e);
  });
};
