const { supportedTokenToStake } = require('../constants')
const BananaAccount = require('../abi/BananaAccount.json')
const { ethers } = require("ethers");
const { AxelarQueryAPI, Environment, EvmChain, GasToken } = require('@axelar-network/axelarjs-sdk')
const WMATIC = require('../abi/WMATIC.json')

const getGasFee = async () => {
    const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

    // Calculate how much gas to pay to Axelar to execute the transaction at the destination chain
    const gasFee = await api.estimateGasFee(
      EvmChain.POLYGON,
      EvmChain.AVALANCHE,
      GasToken.MATIC,
      1000000,
      3,
    );

    return gasFee;
}

const contructLiquidStakingTransaction = async (stakingData) => {
    return {
        success: true,
        context: `This transaction will stake ${stakingData.amount} SOL to Marinade on every Sunday at 8:05 AM`,
        transaction: [
            {
                to: "",
                data: stakingData,
                value: 0,
            },
        ],
    };
}

module.exports = { contructLiquidStakingTransaction }
