import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'
import { decodeFromString } from '@polybase/util'

const schema = `
collection user {
  id: string;
  pvkey: string;
  rating: number;
  attestations: number;
  lies: number;
  active: bool;
  aliases?: string[];

  constructor (id: string, pvkey: string, rating: int, attestations: int, lies: int, active: bool, sessions: string[]) {
    this.id =  id;
    this.pvkey = pvkey;
    this.rating = rating;
    this.attestations = attestations;
    this.lies = lies; 
    this.active = active; 
    this.aliases = aliases;
  }
}

collection session {
  id: string;
  alias: string;
  user: User;
  TTL: number;
  start?: date;
  end?: date;
  status: bool;
  friend?: User;
  peers?: User[];

  constructor (id: string, alias: string, user: User, TTL: int, start: date, end: date, status: bool, friend: User, peers: User[]) {
    this.id =  id;
    this.alias = string;
    this.user = user;
    this.TTL = TTL;
    this.start = start;
    this.end = end; 
    this.status = status; 
    this.friend = friend;
    this.peers = peers;
  }
}

collection {

}

collection point {
  nonce: number;
  x: number;
  y: number;
  recorded: date;
  witnessed: date; 
  session: Session;
}

collection statement {
  record: Point;
  witness: User;
}

collection period {
  id: string;
  cid: string;
  session: Session;
  start?: date;
  end?: date;
  status: bool;
  ratingOfUserWhenRecorded: number;
  rand?: number;
  randProof?: string;
  svg?: string;
  points?: Point[];
}

collection attestation {
  attestor: User;
  period: Period;
  statements: Statement[];
  inconsistences: {
    statements: Statement[];
    latency: number,
    variance: number
  }
  conclusion: bool;
  certainty: number;
  lie: bool;
}
`

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? ''

async function load () {
  const db = new Polybase({
    baseURL: `${process.env.NEXT_PUBLIC_POLYBASE_API_URL}/v0`,
    signer: async (data) => {
      const privateKey = Buffer.from(decodeFromString(PRIVATE_KEY, 'hex'))
      return { h: 'eth-personal-sign', sig: ethPersonalSign(privateKey, data) }
    },
  })

  if (!PRIVATE_KEY) {
    throw new Error('No private key provided')
  }

  await db.applySchema(schema, 'polybase/apps/auth')

  return 'Schema loaded'
}

load()
  .then(console.log)
  .catch(console.error)
