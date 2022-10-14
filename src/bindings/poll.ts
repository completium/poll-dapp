import * as ex from "@completium/dapp-ts";
import * as att from "@completium/archetype-ts-types";
import * as el from "@completium/event-listener";
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
export class ApprovePoll implements att.ArchetypeType {
    constructor(public creator: att.Address, public poll_id: att.Bytes) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.creator.to_mich(), this.poll_id.to_mich()]);
    }
    equals(v: ApprovePoll): boolean {
        return (this.creator.equals(v.creator) && this.creator.equals(v.creator) && this.poll_id.equals(v.poll_id));
    }
}
export type poll_key = att.Bytes;
export type poll_to_approve_key = att.Bytes;
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
export const poll_to_approve_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("bytes", []);
export const responder_key_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("bytes", ["%poll_hash"]),
    att.prim_annot_to_mich_type("address", ["%addr"])
], []);
export class poll_value implements att.ArchetypeType {
    constructor(public responses: Array<[
        att.Nat,
        att.Nat
    ]>, public creation: Date) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([att.list_to_mich(this.responses, x => {
                const x_key = x[0];
                const x_value = x[1];
                return att.elt_to_mich(x_key.to_mich(), x_value.to_mich());
            }), att.date_to_mich(this.creation)]);
    }
    equals(v: poll_value): boolean {
        return (JSON.stringify(this.responses) == JSON.stringify(v.responses) && JSON.stringify(this.responses) == JSON.stringify(v.responses) && (this.creation.getTime() - this.creation.getMilliseconds()) == (v.creation.getTime() - v.creation.getMilliseconds()));
    }
}
export type poll_to_approve_value = att.Address;
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
export const poll_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.pair_to_mich_type("map", att.prim_annot_to_mich_type("nat", []), att.prim_annot_to_mich_type("nat", [])),
    att.prim_annot_to_mich_type("timestamp", ["%creation"])
], []);
export const poll_to_approve_value_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export const responder_value_mich_type: att.MichelineType = att.prim_annot_to_mich_type("unit", []);
export type poll_container = Array<[
    poll_key,
    poll_value
]>;
export type poll_to_approve_container = Array<[
    poll_to_approve_key,
    poll_to_approve_value
]>;
export type responder_container = Array<[
    responder_key,
    responder_value
]>;
export const poll_container_mich_type: att.MichelineType = att.pair_to_mich_type("map", att.prim_annot_to_mich_type("bytes", []), att.pair_array_to_mich_type([
    att.pair_to_mich_type("map", att.prim_annot_to_mich_type("nat", []), att.prim_annot_to_mich_type("nat", [])),
    att.prim_annot_to_mich_type("timestamp", ["%creation"])
], []));
export const poll_to_approve_container_mich_type: att.MichelineType = att.pair_to_mich_type("big_map", att.prim_annot_to_mich_type("bytes", []), att.prim_annot_to_mich_type("address", []));
export const responder_container_mich_type: att.MichelineType = att.pair_to_mich_type("big_map", att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("bytes", ["%poll_hash"]),
    att.prim_annot_to_mich_type("address", ["%addr"])
], []), att.prim_annot_to_mich_type("unit", []));
const add_poll_arg_to_mich = (h: att.Bytes): att.Micheline => {
    return h.to_mich();
}
const approve_arg_to_mich = (h: att.Bytes): att.Micheline => {
    return h.to_mich();
}
const disapprove_arg_to_mich = (h: att.Bytes): att.Micheline => {
    return h.to_mich();
}
const remove_arg_to_mich = (h: att.Bytes): att.Micheline => {
    return h.to_mich();
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
    async add_poll(h: att.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "add_poll", add_poll_arg_to_mich(h), params);
        }
        throw new Error("Contract not initialised");
    }
    async approve(h: att.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "approve", approve_arg_to_mich(h), params);
        }
        throw new Error("Contract not initialised");
    }
    async disapprove(h: att.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "disapprove", disapprove_arg_to_mich(h), params);
        }
        throw new Error("Contract not initialised");
    }
    async remove(h: att.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "remove", remove_arg_to_mich(h), params);
        }
        throw new Error("Contract not initialised");
    }
    async respond(hash: att.Bytes, choice_id: att.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "respond", respond_arg_to_mich(hash, choice_id), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_add_poll_param(h: att.Bytes, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "add_poll", add_poll_arg_to_mich(h), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_approve_param(h: att.Bytes, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "approve", approve_arg_to_mich(h), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_disapprove_param(h: att.Bytes, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "disapprove", disapprove_arg_to_mich(h), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_remove_param(h: att.Bytes, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "remove", remove_arg_to_mich(h), params);
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
                poll_value
            ]> = [];
            for (let e of storage.poll.entries()) {
                res.push([(x => { return new att.Bytes(x); })(e[0]), (x => { return new poll_value((x => { let res: Array<[
                        att.Nat,
                        att.Nat
                    ]> = []; for (let e of x.entries()) {
                        res.push([(x => { return new att.Nat(x); })(e[0]), (x => { return new att.Nat(x); })(e[1])]);
                    } return res; })(x.responses), (x => { return new Date(x); })(x.creation)); })(e[1])]);
            }
            return res;
        }
        throw new Error("Contract not initialised");
    }
    async get_poll_to_approve_value(key: poll_to_approve_key): Promise<poll_to_approve_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.poll_to_approve), key.to_mich(), poll_to_approve_key_mich_type, poll_to_approve_value_mich_type), collapsed = true;
            if (data != undefined) {
                return (x => { return new att.Address(x); })(data.poll_creator);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_poll_to_approve_value(key: poll_to_approve_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.poll_to_approve), key.to_mich(), poll_to_approve_key_mich_type, poll_to_approve_value_mich_type), collapsed = true;
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
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
    register_Response(ep: el.EventProcessor<Response>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "Response"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return new Response((x => { return new att.Address(x); })(x.responder_addr), (x => { return new att.Bytes(x); })(x.poll_id), (x => { return new att.Nat(x); })(x.response));
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    register_NewPoll(ep: el.EventProcessor<NewPoll>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "NewPoll"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return new NewPoll((x => { return new att.Address(x); })(x.creator), (x => { return new att.Bytes(x); })(x.poll_id));
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    register_ApprovePoll(ep: el.EventProcessor<ApprovePoll>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "ApprovePoll"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return new ApprovePoll((x => { return new att.Address(x); })(x.creator), (x => { return new att.Bytes(x); })(x.poll_id));
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        r2: att.string_to_mich("\"CANNOT_RESPOND_TWICE\""),
        r1: att.string_to_mich("\"POLL_NOT_FOUND\""),
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\""),
        POLL_NOT_FOUND: att.string_to_mich("\"POLL_NOT_FOUND\"")
    };
}
export const poll = new Poll();
