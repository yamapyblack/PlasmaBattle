// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract PlasmaBattle is Ownable {
    enum Result {
        NOT_YET,
        WIN,
        LOSE,
        DRAW
    }
    struct Battle {
        address player;
        uint[5] playerUnits;
        uint[5] enemyUnits;
        Result result;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    // mapping(txHash => info)
    mapping(bytes32 => Battle) battleRecord;
    // mapping(playerAddress => stage)
    mapping(address => uint) playerStage;

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor() Ownable(msg.sender) {}

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/

    function startBattle(
        uint[5] memory _playerUnits,
        uint[5] memory _enemyUnits
    ) external {
        battleRecord[blockhash(block.number)] = Battle(
            msg.sender,
            _playerUnits,
            _enemyUnits,
            Result.NOT_YET
        );
    }

    function confirmResult(
        bytes32 _txHash,
        Result _result,
        bytes memory _signature
    ) external {
        // Construct the message hash
        bytes32 messageHash = keccak256(abi.encodePacked(_txHash, _result));
        require(
            ECDSA.recover(messageHash, _signature) == owner(),
            "Invalid signature"
        );
        battleRecord[_txHash].result = _result;
    }
    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                             INTERNAL VIEW
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                            INTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/
}
