import * as att from "@completium/archetype-ts-types";
import * as ex from "@completium/dapp-ts";
import * as el from "@completium/event-listener";

export class NewPoll implements att.ArchetypeType {
    constructor(public creator: att.Address, public poll_id: att.Bytes) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.creator.to_mich(), this.poll_id.to_mich()]);
    }
    equals(v: NewPoll): boolean {
        return (this.creator.equals(v.creator) && this.creator.equals(v.creator) && this.poll_id.equals(v.poll_id));
    }
}
export class Response implements att.ArchetypeType {
    constructor(public responder_addr: att.Address, public poll_id: att.Bytes, public response: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.responder_addr.to_mich(), att.pair_to_mich([this.poll_id.to_mich(), this.response.to_mich()])]);
    }
    equals(v: Response): boolean {
        return (this.responder_addr.equals(v.responder_addr) && this.responder_addr.equals(v.responder_addr) && this.poll_id.equals(v.poll_id) && this.response.equals(v.response));
    }
}
export enum poll_action_types {
    Add = "Add",
    Remove = "Remove"
}
export abstract class poll_action extends att.Enum<poll_action_types> {
}
export class Add extends poll_action {
    constructor(private content: att.Bytes) {
        super(poll_action_types.Add);
    }
    to_mich() { return att.left_to_mich(this.content.to_mich()); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    get() { return this.content; }
}
export class Remove extends poll_action {
    constructor(private content: att.Bytes) {
        super(poll_action_types.Remove);
    }
    to_mich() { return att.right_to_mich(att.left_to_mich(this.content.to_mich())); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    get() { return this.content; }
}
export const mich_to_poll_action = (m: any): poll_action => {
    throw new Error("mich_topoll_action : complex enum not supported yet");
};
export type poll_key = att.Bytes;
export class responder_key implements att.ArchetypeType {
    constructor(public poll_hash: att.Bytes, public addr: att.Address) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.poll_hash.to_mich(), this.addr.to_mich()]);
    }
    equals(v: responder_key): boolean {
        return (this.poll_hash.equals(v.poll_hash) && this.poll_hash.equals(v.poll_hash) && this.addr.equals(v.addr));
    }
}
export const poll_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("bytes", []);
export const responder_key_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("bytes", ["%poll_hash"]),
    att.prim_annot_to_mich_type("address", ["%addr"])
], []);
export type poll_value = Array<[
    att.Nat,
    att.Nat
]>;
export class responder_value implements att.ArchetypeType {
    constructor() { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.unit_to_mich();
    }
    equals(v: responder_value): boolean {
        return true;
    }
}
export const poll_value_mich_type: att.MichelineType = att.pair_to_mich_type("map", att.prim_annot_to_mich_type("nat", []), att.prim_annot_to_mich_type("nat", []));
export const responder_value_mich_type: att.MichelineType = att.prim_annot_to_mich_type("unit", []);
export type poll_container = Array<[
    poll_key,
    poll_value
]>;
export type responder_container = Array<[
    responder_key,
    responder_value
]>;
export const poll_container_mich_type: att.MichelineType = att.pair_to_mich_type("map", att.prim_annot_to_mich_type("bytes", []), att.pair_to_mich_type("map", att.prim_annot_to_mich_type("nat", []), att.prim_annot_to_mich_type("nat", [])));
export const responder_container_mich_type: att.MichelineType = att.pair_to_mich_type("big_map", att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("bytes", ["%poll_hash"]),
    att.prim_annot_to_mich_type("address", ["%addr"])
], []), att.prim_annot_to_mich_type("unit", []));
const manage_poll_arg_to_mich = (a: poll_action): att.Micheline => {
    return a.to_mich();
}
const respond_arg_to_mich = (hash: att.Bytes, choice_id: att.Nat): att.Micheline => {
    return att.pair_to_mich([
        hash.to_mich(),
        choice_id.to_mich()
    ]);
}
const view_get_responses_arg_to_mich = (hash: att.Bytes): att.Micheline => {
    return hash.to_mich();
}
export class Poll {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(owner: att.Address, params: Partial<ex.Parameters>) {
        const address = await ex.deploy("./contracts/poll.arl", {
            owner: owner.to_mich()
        }, params);
        this.address = address;
    }
    async manage_poll(a: poll_action, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "manage_poll", manage_poll_arg_to_mich(a), params);
        }
        throw new Error("Contract not initialised");
    }
    async respond(hash: att.Bytes, choice_id: att.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "respond", respond_arg_to_mich(hash, choice_id), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_manage_poll_param(a: poll_action, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "manage_poll", manage_poll_arg_to_mich(a), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_respond_param(hash: att.Bytes, choice_id: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "respond", respond_arg_to_mich(hash, choice_id), params);
        }
        throw new Error("Contract not initialised");
    }
    async view_get_responses(hash: att.Bytes, params: Partial<ex.Parameters>): Promise<Array<[
        att.Nat,
        att.Nat
    ]>> {
        if (this.address != undefined) {
            const mich = await ex.exec_view(this.get_address(), "get_responses", view_get_responses_arg_to_mich(hash), params);
            let res: Array<[
                att.Nat,
                att.Nat
            ]> = [];
            for (let e of mich.entries()) {
                res.push([(x => { return new att.Nat(x); })(e[0]), (x => { return new att.Nat(x); })(e[1])]);
            }
            return res;
        }
        throw new Error("Contract not initialised");
    }
    async get_owner(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Address(storage.owner);
        }
        throw new Error("Contract not initialised");
    }
    async get_poll(): Promise<poll_container> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            let res: Array<[
                att.Bytes,
                Array<[
                    att.Nat,
                    att.Nat
                ]>
            ]> = [];
            for (let e of storage.poll.entries()) {
                res.push([(x => { return new att.Bytes(x); })(e[0]), (x => { let res: Array<[
                        att.Nat,
                        att.Nat
                    ]> = []; for (let e of x.entries()) {
                        res.push([(x => { return new att.Nat(x); })(e[0]), (x => { return new att.Nat(x); })(e[1])]);
                    } return res; })(e[1])]);
            }
            return res;
        }
        throw new Error("Contract not initialised");
    }
    async get_responder_value(key: responder_key): Promise<responder_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.responder), key.to_mich(), responder_key_mich_type, responder_value_mich_type), collapsed = true;
            if (data != undefined) {
                return new responder_value();
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_responder_value(key: responder_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.responder), key.to_mich(), responder_key_mich_type, responder_value_mich_type), collapsed = true;
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    register_NewPoll(ep: el.EventProcessor<NewPoll>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "NewPoll"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => { return new NewPoll((x => { return new att.Address(x); })(x.creator), (x => { return new att.Bytes(x); })(x.poll_id)); })(raw);
                    ep(event, data);
                } });
            return
        }
        throw new Error("Contract not initialised");
    }
    register_Response(ep: el.EventProcessor<Response>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "Response"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => { return new Response((x => { return new att.Address(x); })(x.responder_addr), (x => { return new att.Bytes(x); })(x.poll_id), (x => { return new att.Nat(x); })(x.response)); })(raw);
                    ep(event, data);
                } });
            return
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        r2: att.string_to_mich("\"CANNOT_RESPOND_TWICE\""),
        r1: att.string_to_mich("\"POLL_NOT_FOUND\""),
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\"")
    };
}
export const poll = new Poll();
