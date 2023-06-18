import { polybase } from './util/polybase'
import { requireAuth } from './util/jwt'
import { ethPersonalSign } from '@polybase/eth'
import { aescbc, decodeFromString } from '@polybase/util'
import { requestHandler } from './util/requestHandler'
import { createError } from './errors'

const {
  ENCRYPTION_KEY = '',
} = process.env

export default requestHandler('POST', async (request: any) => {
  const { msg } = request.body
  const { userId } = await requireAuth(request)

  if (!msg) {
    throw createError('auth/empty-signature-message')
  }

  // Lookup user
  const user = await polybase.collection<EmailUser>('email').record(userId).get()

  if (!user?.data) {
    throw createError('auth/user-id-not-found')
  }

  const privateKeyStr = await aescbc.symmetricDecryptFromEncoding(
    decodeFromString(ENCRYPTION_KEY, 'hex'),
    user.data.pvkey,
    'hex',
  )

  const privateKey = decodeFromString(privateKeyStr, 'hex')
  const sig = ethPersonalSign(privateKey, msg)

  return {
    sig,
  }
})