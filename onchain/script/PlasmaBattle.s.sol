// SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <0.9.0;

import {BaseScript} from "./Base.s.sol";
import {PlasmaBattle} from "../src/PlasmaBattle.sol";
import {console2} from "forge-std/console2.sol";

contract PlasmaBattleScript is BaseScript {
    function run() public broadcast {
        PlasmaBattle battle = new PlasmaBattle();
        console2.log("battle:", address(battle));
    }
}
