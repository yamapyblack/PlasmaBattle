// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.23 <0.9.0;

import {console2} from "forge-std/console2.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import {PlasmaBattle} from "../src/PlasmaBattle.sol";

contract PlasmaBattleTest is StdCheats {
    address internal alice = address(0x1);
    address internal bob = address(0x2);
    address internal charlie = address(0x3);

    PlasmaBattle internal battle;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        battle = new PlasmaBattle();
    }

    function test_setDefaultMetadata() external {
        uint _battleId = 2;
        uint8 _result = 1;
        bytes32 messageHash = keccak256(abi.encodePacked(_battleId, _result));
        //sign by owner
        bytes32 signature = ECDSA.toEthSignedMessageHash(messageHash);

        battle.confirmResult(_battleId, _result, signature);
    }
}
