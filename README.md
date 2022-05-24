1. Dependencies: Node.js, MongoDB
2. API:

- POST /auth/login: request body: {username, password}
- POST /auth/register: request body: {username, password}
- POST /users/deposit: request body: {contract_address (empty if token is ETH), send_token_amount}: deposit into the wallet. The wallet is connected to BSC testnet and the tokens are taken from a signer account. Using locally hosted Ganache node might be more stable
- POST /users/get-balance: request body: {contract_address (empty if token is ETH)}: get specific token balance of the wallet
