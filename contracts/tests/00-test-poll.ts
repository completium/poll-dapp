
import { Bytes } from "@completium/archetype-ts-types";
import {get_account, set_mockup, set_mockup_now, set_quiet} from "@completium/experiment-ts";

import { poll } from './binding/poll'

const assert = require('assert')

/* Accounts ---------------------------------------------------------------- */

const alice = get_account('alice');

/* Verbose mode ------------------------------------------------------------ */

set_quiet(true);

/* Endpoint ---------------------------------------------------------------- */

set_mockup()

/* Now --------------------------------------------------------------------- */

set_mockup_now(new Date(Date.now()))

/* Constants --------------------------------------------------------------- */

const poll_hash_1 = '516d5a3847784177507656444574477879556d6662423164746d7264445236746d4d763948554154616970707155'
const poll_hash_2 = '516d62636553516f467a505941554e6e56666d63346a7559446d3443345a4e334872644a7533566675784e475652'
const poll_hash_3 = '516d646d467a64736669416f54463344614642754e533642475979653871356e5a437567726273663947334e674a'

/* Scenario ---------------------------------------------------------------- */

describe('[POLL] Contract deployment', async () => {
  it('Deploy poll contract', async () => {
    await poll.deploy(alice.get_address(), { as: alice })
  });
})

describe('[POLL] Call entry', async () => {
  it("Call 'add_poll'", async () => {
    await poll.add_poll(new Bytes(poll_hash_1), { as: alice });
  })
})
