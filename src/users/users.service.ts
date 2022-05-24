import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';

import ERC20ABI from './ERC20ABI';
import { BalanceRequest, CreateUserDto, Transaction } from '../dto';
import { User } from '../schemas/user.schema';

// taken from https://explorer.bitquery.io/bsc_testnet/tokens
// ETH is considered the base token for this API
const ETH_CONTRACT_ADDRESS = '0x979db64d8cd5fed9f1b62558547316afedcf4dba';
const USDT_CONTRACT_ADDRESS = '0x5d2aa7650ba5d83ab8ed6789820ec05465cbacc1';

@Injectable()
export class UsersService {
  private ethProvider: ethers.providers.JsonRpcProvider;

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    // BSC testnet
    this.ethProvider = new ethers.providers.JsonRpcProvider(
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
    );
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }

  async create(user: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(user.username);

    if (!!existingUser) {
      return existingUser;
    }

    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async deposit(username: string, data: Transaction) {
    const existingUser = await this.findOne(username);
    // a signer address on BSC, might not be stable
    const signer = this.ethProvider.getSigner(
      '0xA5BD897713b4D43a68187c943b00c98822985C12',
    );

    // Connect to the contract
    const contractAddress =
      data.contract_address === ''
        ? ETH_CONTRACT_ADDRESS
        : data.contract_address;

    const contract = new ethers.Contract(contractAddress, ERC20ABI, signer);

    const numberOfDecimals = 18;
    const numberOfTokens = ethers.utils.parseUnits(
      data.send_token_amount,
      numberOfDecimals,
    );

    return contract.transfer(existingUser.walletAddress, numberOfTokens);
  }

  async getBalance(username: string, data: BalanceRequest) {
    const existingUser = await this.findOne(username);
    const contractAddress =
      data.contract_address === ''
        ? ETH_CONTRACT_ADDRESS
        : data.contract_address;

    const contract = new ethers.Contract(
      contractAddress,
      ERC20ABI,
      this.ethProvider,
    );

    return contract.balanceOf(existingUser.walletAddress);
  }

  // private async connectWallet(username: string) {
  //   const existingUser = await this.findOne(username);
  //   const walletMnemonic = ethers.Wallet.fromMnemonic(existingUser.mnemonic);
  //   return walletMnemonic.connect(this.ethProvider);
  // }
}
