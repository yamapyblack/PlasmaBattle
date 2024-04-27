import { useState } from "react";
import Image from "next/image";
import { Result } from "../../lib/interfaces/interface";
import { Scene } from "../../pages/index";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PlasmaBattleAbi } from "src/constants/plasmaBattleAbi";
import addresses from "src/constants/addresses";

const OverScene = ({ setScene, result, txHash }) => {
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash: hash });

  const confirm = async () => {
    writeContract(
      {
        address: addresses.PlasmaBattle as `0x${string}`,
        abi: PlasmaBattleAbi,
        functionName: "confirmResult",
        args: [txHash, result, signature],
      },
      {
        onSuccess: () => {
          console.log("onSuccess");
          setScene(Scene.Battle);
        },
        onError: (e) => {
          console.error(e);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center m-auto">
      <header className="p-2 w-3/4">
        <div className="flex justify-between items-center w-20 rounded-md bg-darkgray mt-4 pl-2 pr-2">
          <Image src="/images/edit/stage.png" alt="" width={16} height={16} />
          <div className="text-lg font-bold">999</div>
        </div>
      </header>
      <main
        className="flex flex-col"
        style={{ width: "800px", margin: "auto" }}
      >
        <section className="mt-8">
          <div className="flex justify-center p-4">
            <div className="m-2 mx-6 text-xl font-bold">
              {result == Result.WIN ? "YOU WIN" : "YOU LOSE"}
            </div>
          </div>
        </section>
        <section className="mt-8">
          <div className="flex justify-center p-4">
            <div className="m-2 mx-6">
              {result == Result.WIN ? (
                <Image
                  src="/images/gameOver/win-icon.png"
                  alt=""
                  width={320}
                  height={16}
                />
              ) : (
                <Image
                  src="/images/gameOver/lose-icon.png"
                  alt=""
                  width={160}
                  height={16}
                />
              )}
            </div>
          </div>
        </section>
        <section className="mt-16 mb-8">
          <div className="text-center">
            <button
              className="bg-sub font-bold px-8 py-3 rounded-md text-decoration-none"
              onClick={() => {
                if (result == Result.WIN) {
                  confirm();
                } else {
                  setScene(Scene.Battle);
                }
              }}
            >
              {result == Result.WIN ? "CONFIRM" : "CONTINUE"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OverScene;
