/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type {
  TokenCallbackHandler,
  TokenCallbackHandlerInterface,
} from "../TokenCallbackHandler";

const _abi = [
  {
    inputs: [],
    name: "NAME",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "tokensReceived",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080806040523461001657610479908161001c8239f35b600080fdfe60806040908082526004918236101561001757600080fd5b600091823560e01c90816223de29146102e257816301ffc9a71461027257508063150b7a021461021c578063a3f4df7e146101bb578063bc197c8114610132578063f23a6e61146100d95763ffa1ad741461007157600080fd5b346100d557816003193601126100d557805191818301908382106001600160401b038311176100c257506100be9350815260058252640312e302e360dc1b602083015251918291826103bc565b0390f35b634e487b7160e01b815260418552602490fd5b5080fd5b50903461012f5760a036600319011261012f576100f461035e565b506100fd610379565b50608435906001600160401b03821161012f57506020926101209136910161038f565b50505163f23a6e6160e01b8152f35b80fd5b50903461012f5760a036600319011261012f5761014d61035e565b50610156610379565b506001600160401b03906044358281116100d5576101779036908601610413565b50506064358281116100d5576101909036908601610413565b505060843591821161012f57506020926101ac9136910161038f565b50505163bc197c8160e01b8152f35b50346100d557816003193601126100d557805191818301908382106001600160401b038311176100c257506100be9350815260188252772232b330bab63a1021b0b6363130b1b5902430b7323632b960411b602083015251918291826103bc565b50903461012f57608036600319011261012f5761023761035e565b50610240610379565b50606435906001600160401b03821161012f57506020926102639136910161038f565b505051630a85bd0160e11b8152f35b839085346102de5760203660031901126102de573563ffffffff60e01b81168091036102de5760209250630271189760e51b81149081156102cd575b81156102bc575b5015158152f35b6301ffc9a760e01b149050836102b5565b630a85bd0160e11b811491506102ae565b8280fd5b839085346102de5760c03660031901126102de576102fe61035e565b50610307610379565b506044356001600160a01b038116036102de576001600160401b039060843582811161035a5761033a903690830161038f565b505060a435918211610356576103529136910161038f565b5050f35b8380fd5b8480fd5b600435906001600160a01b038216820361037457565b600080fd5b602435906001600160a01b038216820361037457565b9181601f84011215610374578235916001600160401b038311610374576020838186019501011161037457565b919091602080825283519081818401526000945b8286106103fd5750508060409394116103f0575b601f01601f1916010190565b60008382840101526103e4565b85810182015184870160400152948101946103d0565b9181601f84011215610374578235916001600160401b038311610374576020808501948460051b0101116103745756fea2646970667358221220b2068ff47c2db9c140e4b789b20c383748dfc19d9440bab00745c90e95e2eba464736f6c634300080f0033";

type TokenCallbackHandlerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenCallbackHandlerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenCallbackHandler__factory extends ContractFactory {
  constructor(...args: TokenCallbackHandlerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TokenCallbackHandler> {
    return super.deploy(overrides || {}) as Promise<TokenCallbackHandler>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TokenCallbackHandler {
    return super.attach(address) as TokenCallbackHandler;
  }
  override connect(signer: Signer): TokenCallbackHandler__factory {
    return super.connect(signer) as TokenCallbackHandler__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenCallbackHandlerInterface {
    return new utils.Interface(_abi) as TokenCallbackHandlerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenCallbackHandler {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TokenCallbackHandler;
  }
}
