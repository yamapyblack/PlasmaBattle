# PlasmaBattle


![PlasmaBattle-logo](https://raw.githubusercontent.com/yamapyblack/PlasmaBattle/main/frontend/public/PlasmaBattle-logo.png)

A starategic game with infinite scalablity

## Demo

https://plasma-battle.vercel.app/

## Description

**Does an onchain game have to be fully onchain?**

I'm an onchain maxi, but I disagree with the question. Let's consider Layer2 and Plasma. These technologies mean that not all transactions are necessary on Ethereum L1. Layer2 and Plasma try to make Ethereum's scalable with minimizing risks.

Similarly, it's not necessary to put all game logic onchain. The Plasma architecture, which is implemented in this game, is a stateless design intended for a risk-minimized hybrid app. It enables an authentic, complex simulation game on the mainnet.

PlasmaBattle will open the door to mass adoption for onchain games.


## Architecture

![PlasmaBattle-architecutre](https://github.com/yamapyblack/PlasmaBattle/blob/main/frontend/public/images/lp/PlasmaBattle-architecutre.png?raw=true)

The necessary information for onchain is only required at the start and at the end; the computing of the middle phase is offchain. The battle result is determined by the computation of the game master. Some criticize this as centralization, but in fact, the risk is quite minimal.

The battle logic can be computed by anyone because the source code is open, so any mistakes by the game master can be pointed out.

Users only need to send two transactions, at the beginning and at the end, using the Plasma Architecture. This architecture makes onchain games infinitely scalable.

## Contract addresses(Scroll sepolia)

PlasmaBattle

https://sepolia.scrollscan.com/address/0xc7Bab26f78A8ac0C573B0670D85c590aF3dD9Fa4

