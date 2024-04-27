import { useState } from "react";
import { postBattleAllApi } from "../lib/data/apiHandler";
import { getAllStates } from "../lib/data/stateHandler";
import { IUnitParam } from "../lib/interfaces/interface";

const ApiTest = () => {
  const [apiResponse, setApiResponse] = useState("");

  return (
    <div>
      <button
        onClick={() => {
          console.log("action");
          // postBattleAllApi()
          //   .then((response) => {
          //     console.log("response", response);
          //     setApiResponse(JSON.stringify(response));
          //   })
          //   .catch((error) => console.error("Error:", error));
        }}
      >
        action
      </button>
      <div>{apiResponse}</div>
    </div>
  );
};

export default ApiTest;
