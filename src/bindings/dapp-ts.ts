import { Address, CallParameter, Micheline, MichelineType, Tez } from "@completium/archetype-ts-types";
import { emitMicheline, MichelsonData, packDataBytes } from '@taquito/michel-codec';
import { Schema } from '@taquito/michelson-encoder';
import { OpKind, ParamsWithKind, TezosToolkit } from '@taquito/taquito';
import { encodeExpr } from '@taquito/utils';

// global toolkit
let tezos: TezosToolkit | undefined = undefined

export const set_binder_tezos_toolkit = (ttk: TezosToolkit) => {
  tezos = ttk
}

export interface Parameters {
  amount?: Tez
  fee?: Tez
}

export const get_call_param = async (addr: string, entry: string, arg: Micheline, p: Parameters): Promise<CallParameter> => {
  return {
    destination: new Address(addr),
    amount: new Tez(p.amount ? p.amount.toString() : 0, "mutez"),
    fee: new Tez(p.fee ? p.fee.toString() : 0, "mutez"),
    entrypoint: entry,
    arg: arg
  }
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

export const get_balance = async (addr: Address): Promise<Tez> => {
  const res = await tezos?.tz.getBalance(addr.toString());
  if (res === undefined) {
    throw new Error("Error: get_balance");
  }
  return new Tez(res, "mutez")
}

export const get_storage = async (addr: string): Promise<any> => {
  return tezos?.contract.at(addr).then(async contract => {
    return await contract.storage()
  })
}

function toMichelsonData(m: Micheline): MichelsonData {
  return (m as MichelsonData)
}

export const get_big_map_value = async (id: BigInt, data: Micheline, type_key: MichelineType, type_value: MichelineType): Promise<any> => {
  const d: MichelsonData = toMichelsonData(data);
  const input = packDataBytes(d, type_key).bytes;
  const expr = encodeExpr(input);
  const res = await tezos?.rpc.getBigMapExpr(id.toString(), expr);
  const schema = new Schema(type_value);
  return schema.Execute(res);
}

export const exec_view = async (address: Address, entry: string, arg: Micheline, params: Parameters): Promise<any> => {
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

export const exec_batch = async (callParameters: CallParameter[]): Promise<any> => {
  const paramsWithKinds: ParamsWithKind[] = callParameters.map(x => {
    return {
      kind: OpKind.TRANSACTION,
      to: x.destination.toString(),
      amount: x.amount.to_big_number().toNumber(),
      fee: x.fee ? x.fee.to_big_number().toNumber() : undefined,
      parameter: {
        entrypoint: x.entrypoint,
        value: toMichelsonData(x.arg)
      },
      mutez: true
    }
  });
  const batch = tezos?.contract.batch(paramsWithKinds);
  if (batch === undefined) {
    throw new Error("Error: Invalid batch");
  }
  return new Promise(async (resolve, reject) => {
    try {
      const op = await batch.send();
      // console.log(`Waiting for ${op.hash} to be confirmed ...`);
      await op.confirmation(1);
      // console.log(`${op.hash} confirmed ...`);
      resolve(op)
    } catch (error) {
      reject(error);
    }
  });
}
