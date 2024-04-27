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

    event BattleIdIncremented(uint battleId);

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    uint public battleId;
    // mapping(battlId => info)
    mapping(uint => Battle) public battleRecord;
    // mapping(playerAddress => stage)
    mapping(address => uint) public playerStage;

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
    ) external returns (uint) {
        battleId++;
        emit BattleIdIncremented(battleId);
        battleRecord[battleId] = Battle(
            msg.sender,
            _playerUnits,
            _enemyUnits,
            Result.NOT_YET
        );
        return battleId;
    }

    function confirmResult(
        uint _battleId,
        Result _result,
        bytes memory _signature
    ) external {
        // Construct the message hash
        bytes32 messageHash = keccak256(abi.encodePacked(_battleId, _result));
        require(
            ECDSA.recover(messageHash, _signature) == owner(),
            "Invalid signature"
        );
        battleRecord[_battleId].result = _result;
    }

    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/
    function getBothUnits(
        uint _battleId
    ) external view returns (uint[5] memory, uint[5] memory) {
        return (
            battleRecord[_battleId].playerUnits,
            battleRecord[_battleId].enemyUnits
        );
    }

    /*//////////////////////////////////////////////////////////////
                             INTERNAL VIEW
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                            INTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/
}
