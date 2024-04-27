import { useState } from "react";
import BattleScene from "../components/scenes/battleScene";
import EditScene from "../components/scenes/editScene";
import OverScene from "../components/scenes/overScene";
import { UnitsProvider } from "../lib/contexts/UnitsContext";
import { Result } from "../lib/interfaces/interface";
import { useAccount } from "wagmi";
import { ConnectWallet } from "../components/ConnectWallet";

export enum Scene {
  Edit,
  Battle,
  Over,
}

const Ingame = () => {
  const [scene, setScene] = useState(Scene.Battle);
  const [result, setResult] = useState(Result.NOT_YET);
  const [txHash, setTxHash] = useState<string>("");
  const { isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <UnitsProvider>
          {scene === Scene.Edit ? (
            <EditScene setScene={setScene} />
          ) : scene === Scene.Battle ? (
            <BattleScene
              setScene={setScene}
              setResult={setResult}
              setTxHash={setTxHash}
            />
          ) : (
            <OverScene setScene={setScene} result={result} txHash={txHash} />
          )}
        </UnitsProvider>
      ) : (
        <div className="flex flex-col items-center m-auto mt-80">
          <ConnectWallet />
        </div>
      )}
    </>
  );
};

export default Ingame;
