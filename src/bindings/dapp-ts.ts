import { Address, CallParameter, Micheline, MichelineType, none_mich, Tez } from "@completium/archetype-ts-types";
import { TezosToolkit } from '@taquito/taquito';
import { emitMicheline } from '@taquito/michel-codec';

// global toolkit
let tezos: TezosToolkit | undefined = undefined

export const set_binder_tezos_toolkit = (ttk: TezosToolkit) => {
  tezos = ttk
}

export interface Parameters {
  amount ?: Tez
  fee ?: Tez
}

export const get_call_param = async (addr: string, name: string, arg: Micheline, p: Parameters): Promise<CallParameter> => {
  return { destination: new Address(''), amount: new Tez(0), entrypoint: "", arg: none_mich }
}

export const call = async (addr: string, name: string, arg: Micheline, p: Parameters) => {
  const amount = p.amount === undefined ? 0 : p.amount.to_big_number().toNumber();
  const fee = p.fee === undefined ? 0 : p.fee.to_big_number().toNumber()

  const transferParam = { to: addr, amount: amount, fee: fee > 0 ? fee : undefined, mutez: true, parameter: { entrypoint: name, value: arg } };

  return new Promise((resolve, reject) => {
    tezos?.wallet
      .transfer(transferParam)
      .send()
      .then((op) => {
        return op.confirmation(1).then(() => op);
      })
      .then((op) => {
        return resolve(op)
      })
      .catch(
        error => {
          reject(error);
        }
      );
  })
}

export const get_balance = async (addr : Address) : Promise<Tez> => {
  const res = await tezos?.tz.getBalance(addr.toString());
  if (res === undefined) {
    throw new Error("Error: get_balance");
  }
  return new Tez(res, "mutez")
}

export const get_storage = async (addr : string) : Promise<any> => {
  return tezos?.contract.at(addr).then(async contract => {
    return await contract.storage()
  })
}

export const get_big_map_value = async (id : BigInt, m : Micheline, mt : MichelineType) : Promise<any> => {
  const res = none_mich;
  return res
}

export const exec_view = async (address : Address, entry : string, arg : Micheline, params : Parameters) : Promise<any> => {
  const user_pkh = await tezos?.wallet.pkh();
  if (user_pkh === undefined) {
    throw new Error("No wallet pkh");
  }
  const c = await tezos?.wallet.at(address.toString());
  if (c === undefined) {
    throw new Error(`Contract ${address.toString()} not found`);
  }

  const input = emitMicheline(arg);
  const a = c.contractViews[entry](input);
  const b = await a.executeView({ viewCaller: user_pkh })
  return b
}