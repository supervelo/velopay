/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type {
  MultiSendCallOnly,
  MultiSendCallOnlyInterface,
} from "../MultiSendCallOnly";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "transactions",
        type: "bytes",
      },
    ],
    name: "multiSend",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001657610191908161001c8239f35b600080fdfe6080604052600436101561001257600080fd5b6000803560e01c638d80ff0a1461002857600080fd5b60203660031901126100d25760043567ffffffffffffffff8082116100ce57366023830112156100ce57828260040135928284116100c1575b60405192601f8501601f19908116603f01168401908111848210176100b4575b60405283835236602485830101116100b057836100ab9460246020930183860137830101526100ec565b604051f35b5080fd5b6100bc6100d5565b610081565b6100c96100d5565b610061565b8280fd5b80fd5b50634e487b7160e01b600052604160045260246000fd5b80519060205b8281106100fe57505050565b808201805160f81c600182015160601c91601581015191603582015180946000948593948560001461014a575050505050600114610145575b1561014557016055016100f2565b600080fd5b605591929394955001915af161013756fea2646970667358221220287f59e8e22708352bc86e9bcb9c9c7993dd6a8dc160b579765accf847aca5eb64736f6c634300080f0033";

type MultiSendCallOnlyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MultiSendCallOnlyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MultiSendCallOnly__factory extends ContractFactory {
  constructor(...args: MultiSendCallOnlyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MultiSendCallOnly> {
    return super.deploy(overrides || {}) as Promise<MultiSendCallOnly>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MultiSendCallOnly {
    return super.attach(address) as MultiSendCallOnly;
  }
  override connect(signer: Signer): MultiSendCallOnly__factory {
    return super.connect(signer) as MultiSendCallOnly__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MultiSendCallOnlyInterface {
    return new utils.Interface(_abi) as MultiSendCallOnlyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MultiSendCallOnly {
    return new Contract(address, _abi, signerOrProvider) as MultiSendCallOnly;
  }
}
