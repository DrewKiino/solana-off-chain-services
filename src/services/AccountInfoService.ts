import * as Web3 from '@solana/web3.js'
import { create } from "superstruct";
import { StakeAccount } from '../accounts/stake';
import { ParsedInfo } from '../validators';
import { ConfigAccount } from '../validators/accounts/config';
import { NonceAccount } from '../validators/accounts/nonce';
import { SysvarAccount } from '../validators/accounts/sysvar';
import { ProgramDataAccount, ProgramDataAccountInfo, UpgradeableLoaderAccount } from '../validators/accounts/upgradeable-program';
import { VoteAccount } from '../validators/accounts/vote';
import { TokenAccount } from '../validators/token';

export type StakeProgramData = {
  program: "stake";
  parsed: StakeAccount;
  activation?: Web3.StakeActivationData;
};

export type UpgradeableLoaderAccountData = {
  program: "bpf-upgradeable-loader";
  parsed: UpgradeableLoaderAccount;
  programData?: ProgramDataAccountInfo;
};

export type TokenProgramData = {
  program: "spl-token";
  parsed: TokenAccount;
};

export type VoteProgramData = {
  program: "vote";
  parsed: VoteAccount
};

export type NonceProgramData = {
  program: "nonce";
  parsed: NonceAccount
};

export type SysvarProgramData = {
  program: "sysvar";
  parsed: SysvarAccount;
};

export type ConfigProgramData = {
  program: "config";
  parsed: ConfigAccount;
};

export type ProgramData =
  | UpgradeableLoaderAccountData
  | StakeProgramData
  | TokenProgramData
  | VoteProgramData
  | NonceProgramData
  | SysvarProgramData
  | ConfigProgramData;

export interface Details {
  executable: boolean;
  owner: Web3.PublicKey;
  space: number;
  data?: ProgramData;
}

export interface Account {
  pubkey: Web3.PublicKey;
  lamports: number;
  details?: Details;
}

export async function fetchAccountInfo(
  connection: Web3.Connection,
  pubkey: Web3.PublicKey
): Promise<any> {
  let data;
  try {
    const result = (await connection.getParsedAccountInfo(pubkey)).value;

    let lamports, details;
    if (result === null) {
      lamports = 0;
    } else {
      lamports = result.lamports;

      // Only save data in memory if we can decode it
      let space: number;
      if (!("parsed" in result.data)) {
        space = result.data.length;
      } else {
        space = result.data.space;
      }

      let data: ProgramData | undefined;
      if ("parsed" in result.data) {
        try {
          const info = create(result.data.parsed, ParsedInfo);
          switch (result.data.program) {
            case "bpf-upgradeable-loader": {
              const parsed = create(info, UpgradeableLoaderAccount);

              // Fetch program data to get program upgradeability info
              let programData: ProgramDataAccountInfo | undefined;
              if (parsed.type === "program") {
                const result = (
                  await connection.getParsedAccountInfo(parsed.info.programData)
                ).value;
                if (
                  result &&
                  "parsed" in result.data &&
                  result.data.program === "bpf-upgradeable-loader"
                ) {
                  const info = create(result.data.parsed, ParsedInfo);
                  programData = create(info, ProgramDataAccount).info;
                } else {
                  throw new Error(
                    `invalid program data account for program: ${pubkey.toBase58()}`
                  );
                }
              }

              data = {
                program: result.data.program,
                parsed,
                programData,
              };

              break;
            }
            case "stake": {
              const parsed = create(info, StakeAccount);
              const isDelegated = parsed.type === "delegated";
              const activation = isDelegated
                ? await connection.getStakeActivation(pubkey)
                : undefined;

              data = {
                program: result.data.program,
                parsed,
                activation,
              };
              break;
            }
            case "vote":
              data = {
                program: result.data.program,
                parsed: create(info, VoteAccount),
              };
              break;
            case "nonce":
              data = {
                program: result.data.program,
                parsed: create(info, NonceAccount),
              };
              break;
            case "sysvar":
              data = {
                program: result.data.program,
                parsed: create(info, SysvarAccount),
              };
              break;
            case "config":
              data = {
                program: result.data.program,
                parsed: create(info, ConfigAccount),
              };
              break;

            case "spl-token":
              data = {
                program: result.data.program,
                parsed: create(info, TokenAccount),
              };
              break;
            default:
              data = undefined;
          }
        } catch (error) {
          console.log(`${error} ${pubkey.toBase58()}`)
        }
      }

      details = {
        space,
        executable: result.executable,
        owner: result.owner,
        data,
      };
    }
    data = { pubkey, lamports, details };
  } catch (error) {
    console.log(error)
  }
  return data
}