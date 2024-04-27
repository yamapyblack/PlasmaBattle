// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.23 <0.9.0;

import {console2} from "forge-std/console2.sol";
import {Test} from "forge-std/Test.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

import {PlasmaBattle} from "../src/PlasmaBattle.sol";

contract PlasmaBattleTest is Test {
    address internal signer;

    PlasmaBattle internal battle;

    uint256 internal userPrivateKey;
    uint256 internal signerPrivateKey;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        signerPrivateKey = 0xabc123;

        signer = vm.addr(signerPrivateKey);
        vm.prank(signer);
        battle = new PlasmaBattle();
    }

    function test_confirmResult() external {
        uint _battleId = 2;
        uint8 _result = 1;

        vm.startPrank(signer);
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(
            keccak256(abi.encodePacked(_battleId, _result))
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPrivateKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v); // note the order here is different from line above.
        vm.stopPrank();

        battle.confirmResult(_battleId, _result, signature);
        (, uint8 result) = battle.getBattleInfo(_battleId);
        assertEq(result, _result);
    }
}
