export class UserAuthDto {
  readonly username: string;
  readonly password: string;
}

export class CreateUserDto {
  readonly username: string;
  readonly passwordHash: string;
  readonly walletAddress: string;
  readonly mnemonic: string;
}

export class Transaction {
  contract_address: string;
  send_token_amount: string;
}

export class BalanceRequest {
  contract_address: string;
}
