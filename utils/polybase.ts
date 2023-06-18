import { Polybase } from '@polybase/client'

const polybase = new Polybase({
  baseURL: `${process.env.NEXT_PUBLIC_POLYBASE_API_URL}/v0`,
})

export default polybase
