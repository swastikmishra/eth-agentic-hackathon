
## MirrorBattle

MirrorBattle is a platform where crypto traders deploy agents to copy-trade 'smart money wallets' and compete in PvP battles.

Github: https://github.com/swastikmishra/eth-agentic-hackathon

Projec URL: https://ethglobal.com/showcase/mirrorbattle-qqvi8

App URL: https://eth-agentic-hackathon-app.vercel.app/

### Overview

The platform MirrorBattle provides agentic tools for traders to follow “smart money wallets” and execute copy-trades based on a set of customizable criteria. Each trader configures his own agent, deposits a certain amount of USDC into the agentic wallet, and engages with a PvP competition of trading. On a 7-day rolling basis, a PvP battle is conducted and snapshots of beginning and ending balance of the agent wallets are taken. The trader with an agent earning higher return % wins the battle.

### Key Features

* Frictionless onboarding and creation of embedded wallets. 
* Leveraging both pre-screened smart money wallets and custom wallet addresses for copy trades.
* Agentic wallets for automated copy-trades. 
* Gasless transactions on EVM via 0x API
* Customizable parameters for the deployment of copy-trade agents:
	* Thresholds (in USD value) to trigger copy-trade

### Roadmap & Future Plans

* Improvement of UI&UX design
* Add profit-taking & stop-loss rules to the agents 
* Add multi-chain support, including Solana
* Add prize pool and prediction market for each PvP battle


### Status Symbols

❌Pending
🔄 In Progress
✅ Completed
🚫Blocked

### Status

| Module            | Features                                  | Status         |
| ----------------- | ----------------------------------------- | -------------- |
| User Management   | - Privy Authentication                    | ✅ Completed   |
| Wallet Management | - Privy Server Wallets Integration        | ✅ Completed   |
|                   | - Generate user wallet                    | ✅ Completed   |
|                   | - Wallet transactions & snapshots         | 🔄 In Progress |
| Dashboard         | - Display user's wallet and agent wallets | ✅ Completed   |
|                   | - Transaction history                     | ❌Pending      |
|                   | - Token values in USD and total balance   | ✅ Completed   |
|                   | - Use Moralis API                         | ✅ Completed   |
| Trader            | - Top trader scraping                     | ✅ Completed   |
|                   | - Custom trader                           | ✅ Completed   |
|                   | - Scheduler (sync every 30 mins)          | 🔄 In Progress |
|                   | - Add nickname                            | ✅ Completed   |
| Agent             | - Create agent with initial fund          | ❌Pending      |
|                   | - Create agent wallet                     | ❌Pending      |
|                   | - Add nickname                            | ❌Pending      |
| Agent Execution   | - Listen to active trader transactions    | ❌Pending      |
|                   | - Follow buy orders                       | ❌Pending      |
|                   | - Stop loss                               | ❌Pending      |
|                   | - Kill/Stop agent                         | ❌Pending      |
| 0x Implementation | - Implement 0x protocol for Gasless Swaps | ❌Pending      |
| PvP Battle        | - Conduct PvP battle                      | 🚫Blocked      |

### Test Users

| Email              | Phone number    | OTP code |
| ------------------ | --------------- | -------- |
| test-3250@privy.io | +1 555 555 0073 | 076747   |
| test-3538@privy.io | +1 555 555 2583 | 798083   |

Test Smart Wallet: 0xE1054F7b83dDa65401ef9f213350486168952F0c


